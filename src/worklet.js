// PB-303 voice + sequencer. Runs inside an AudioWorkletGlobalScope.
// Written as a function so the page can stringify it into a Blob URL
// and so Node tests can run it with mocked globals.
function workletMain() {
  const TWO_PI = Math.PI * 2;
  const OS = 4; // filter oversampling

  function tanhf(x) {
    if (x < -3) return -1;
    if (x > 3) return 1;
    const x2 = x * x;
    return x * (27 + x2) / (27 + 9 * x2);
  }
  function polyblep(t, dt) {
    if (t < dt) { t /= dt; return t + t - t * t - 1; }
    if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
    return 0;
  }

  class PB303 extends AudioWorkletProcessor {
    constructor() {
      super();
      this.sr = sampleRate;
      // user params: target + smoothed copy
      this.tp = { tune: .5, cut: .32, res: .72, env: .7, dec: .32, acc: .65, vol: .7, wave: 0, dist: 0, delay: 0, reverb: 0 };
      this.sp = Object.assign({}, this.tp);
      this.bpm = 128;
      this.smooth = 1 - Math.exp(-1 / (0.006 * this.sr));

      // sequencer
      this.run = false;
      this.seq = [];        // [kind, midi, acc, sld]
      this.pending = null;
      this.idx = 0;
      this.acc = 0;         // samples into current step
      this.startPending = false;
      this.gateOffAt = -1;
      this.slidePrev = false;
      this.gateFrac = 0.56;

      // voice
      this.gate = false;
      this.pitch = 36; this.pitchT = 36;
      this.ph = 0;
      this.amp = 0;
      this.e = 0;             // filter envelope
      this.accNote = false;
      this.accCharge = 0;
      this.oct = 8;           // smoothed cutoff in octaves (log2 Hz)
      this.y = [0, 0, 0, 0];
      this.th = [0, 0, 0];
      this.xPrev = 0;
      this.dcX = 0; this.dcY = 0;
      // ping-pong delay (3/16 of a beat-grid step group, ~dotted eighth)
      this.DM = 131071;
      this.dbL = new Float32Array(this.DM + 1); this.dbR = new Float32Array(this.DM + 1);
      // Freeverb-style stereo reverb
      const k = this.sr / 44100;
      const mk = (n) => ({ b: new Float32Array(Math.round(n * k)), i: 0, f: 0 });
      this.combL = [1116, 1188, 1277, 1356].map(mk);
      this.combR = [1139, 1211, 1300, 1379].map(mk);
      this.apL = [556, 441].map(mk); this.apR = [579, 464].map(mk);
      this.dw = 0; this.dtS = this.sr * 15 / 128 * 3; this.dfL = 0; this.dfR = 0;

      this.slideCoef = 1 - Math.exp(-1 / (0.024 * this.sr));
      this.aCoef = 1 - Math.exp(-1 / (0.0009 * this.sr));
      this.rCoef = 1 - Math.exp(-1 / (0.009 * this.sr));
      this.octCoef = 1 - Math.exp(-1 / (0.0016 * this.sr));
      this.accDecay = Math.exp(-1 / (0.45 * this.sr));
      this.eCoef = 0.9999;

      this.port.onmessage = (ev) => this.onMsg(ev.data);
    }

    onMsg(m) {
      switch (m.t) {
        case 'p': Object.assign(this.tp, m.p); if (m.snap) Object.assign(this.sp, m.p); break;
        case 'bpm': this.bpm = m.v; break;
        case 'seq':
          if (m.at === 'bar' && this.run && this.seq.length) this.pending = m.seq;
          else { this.seq = m.seq; this.pending = null; if (this.idx >= this.seq.length) this.idx = 0; }
          break;
        case 'run':
          if (m.on) { this.run = true; this.idx = 0; this.acc = 0; this.startPending = true; this.slidePrev = false; }
          else { this.run = false; this.gate = false; this.gateOffAt = -1; this.slidePrev = false; }
          break;
        case 'reset':
          this.idx = 0; this.acc = 0; this.startPending = true; this.slidePrev = false;
          break;
        case 'on': this.trigger(m.note, !!m.acc, !!m.sld && this.gate); this.gateOffAt = -1; this.slidePrev = false; break;
        case 'off': this.gate = false; this.gateOffAt = -1; break;
      }
    }

    trigger(note, acc, slideIn) {
      this.pitchT = note;
      if (!slideIn || !this.gate) {
        this.pitch = note;
        this.e = 1;
        if (acc) this.accCharge += (1 - this.accCharge) * 0.3;
      }
      this.accNote = acc;
      this.gate = true;
    }

    stepAt(i) {
      const s = this.seq;
      if (!s.length) return null;
      return s[i];
    }

    nextStep() {
      const n = this.seq.length;
      if (this.idx + 1 < n) return this.seq[this.idx + 1];
      return (this.pending && this.pending.length) ? this.pending[0] : this.seq[0];
    }

    startStep() {
      const n = this.seq.length;
      if (!n) return;
      const s = this.seq[this.idx];
      const nx = this.nextStep();
      const stepLen = this.sr * 15 / this.bpm;
      const kind = s[0];
      if (kind === 1) {
        const slideIn = this.slidePrev && this.gate;
        this.trigger(s[1], !!s[2], slideIn);
        this.slidePrev = !!s[3];
        const extend = nx[0] === 2 || (s[3] && nx[0] === 1);
        this.gateOffAt = extend ? -1 : stepLen * this.gateFrac;
      } else if (kind === 2 && this.gate) {
        const extend = nx[0] === 2 || (this.slidePrev && nx[0] === 1);
        this.gateOffAt = extend ? -1 : stepLen * this.gateFrac;
      } else {
        this.gate = false;
        this.gateOffAt = -1;
        this.slidePrev = false;
      }
      this.port.postMessage({ t: 's', i: this.idx });
    }

    tickSeq() {
      if (!this.seq.length) return;
      if (this.startPending) { this.startPending = false; this.startStep(); }
      if (this.gateOffAt >= 0 && this.acc >= this.gateOffAt) { this.gate = false; this.gateOffAt = -1; }
      this.acc += 1;
      const stepLen = this.sr * 15 / this.bpm;
      if (this.acc >= stepLen) {
        this.acc -= stepLen;
        this.idx++;
        if (this.idx >= this.seq.length) {
          this.idx = 0;
          if (this.pending) { this.seq = this.pending; this.pending = null; if (!this.seq.length) { this.gate = false; return; } }
        }
        this.startStep();
      }
    }

    process(inputs, outputs) {
      const out = outputs[0];
      const ch = out[0];
      const n = ch.length;
      const sp = this.sp, tp = this.tp, sm = this.smooth;
      const sr = this.sr;
      const y = this.y, th = this.th;

      for (let i = 0; i < n; i++) {
        if (this.run) this.tickSeq();

        // param smoothing
        sp.tune += (tp.tune - sp.tune) * sm;
        sp.cut += (tp.cut - sp.cut) * sm;
        sp.res += (tp.res - sp.res) * sm;
        sp.env += (tp.env - sp.env) * sm;
        sp.dec += (tp.dec - sp.dec) * sm;
        sp.acc += (tp.acc - sp.acc) * sm;
        sp.vol += (tp.vol - sp.vol) * sm;
        sp.dist += (tp.dist - sp.dist) * sm;
        sp.delay += (tp.delay - sp.delay) * sm;
        sp.reverb += (tp.reverb - sp.reverb) * sm;
        sp.wave = tp.wave;

        // pitch (slide)
        this.pitch += (this.pitchT - this.pitch) * this.slideCoef;
        const semis = this.pitch + (sp.tune - 0.5) * 2;
        const f = 440 * Math.pow(2, (semis - 69) / 12);
        const dt = Math.min(0.45, f / sr);

        // oscillator
        let ph = this.ph + dt;
        if (ph >= 1) ph -= 1;
        this.ph = ph;
        let osc;
        if (sp.wave < 0.5) {
          osc = 1 - 2 * ph + polyblep(ph, dt);            // falling saw
        } else {
          let p2 = ph + 0.5; if (p2 >= 1) p2 -= 1;
          osc = (ph < 0.5 ? 1 : -1) + polyblep(ph, dt) - polyblep(p2, dt);
          osc *= 0.9;
        }

        // envelopes
        this.accCharge *= this.accDecay;
        const accAmt = this.accNote ? sp.acc * (0.5 + 0.5 * Math.min(1, this.accCharge * 1.2)) : 0;
        const decT = this.accNote ? 0.2 : 0.2 * Math.pow(10, sp.dec);
        this.e *= Math.exp(-1 / (decT * sr));
        const tgtAmp = this.gate ? 1 : 0;
        this.amp += (tgtAmp - this.amp) * (this.gate ? this.aCoef : this.rCoef);

        // cutoff
        const baseOct = Math.log2(55) + sp.cut * 6.8;
        const octT = baseOct + (sp.env * 3.9 + accAmt * (1.1 + 1.1 * sp.res)) * this.e;
        this.oct += (octT - this.oct) * this.octCoef;
        let fc = Math.pow(2, this.oct);
        if (fc > 17000) fc = 17000;
        const g = 1 - Math.exp(-TWO_PI * fc / (sr * OS));
        const k = Math.min(4.35, sp.res * 3.95 + accAmt * 0.45);

        // 4-pole ladder, oversampled
        const x0 = osc * 1.15;
        let yo = 0;
        for (let j = 1; j <= OS; j++) {
          const xin = this.xPrev + (x0 - this.xPrev) * (j / OS);
          const u = tanhf(xin - k * y[3]);
          y[0] += g * (u - th[0]); th[0] = tanhf(y[0]);
          y[1] += g * (th[0] - th[1]); th[1] = tanhf(y[1]);
          y[2] += g * (th[1] - th[2]); th[2] = tanhf(y[2]);
          y[3] += g * (th[2] - tanhf(y[3]));
        }
        this.xPrev = x0;
        yo = 0.5 * y[3] + 0.5 * y[2];

        // VCA
        const vca = this.amp * (1 + 0.85 * accAmt);
        let s = yo * (1.0 + 0.5 * k) * vca * 1.25;

        // drive / output
        if (sp.dist > 0.001) {
          const d = 1 + sp.dist * 7;
          s = tanhf(s * d) / Math.sqrt(d) * 1.1;
        }
        s = tanhf(s * 0.9);
        const vol = sp.vol * sp.vol * 1.05;
        s *= vol;

        // DC block
        const dc = s - this.dcX + 0.995 * this.dcY;
        this.dcX = s; this.dcY = dc;
        // delay
        const tgt = Math.min(this.DM - 4, this.sr * 15 / this.bpm * 3);
        this.dtS += (tgt - this.dtS) * 0.0004;
        let rp = this.dw - this.dtS; if (rp < 0) rp += this.DM + 1;
        const ri = rp | 0, fr = rp - ri, r1 = (ri + 1) & this.DM;
        const dl = this.dbL[ri] + (this.dbL[r1] - this.dbL[ri]) * fr;
        const dr = this.dbR[ri] + (this.dbR[r1] - this.dbR[ri]) * fr;
        this.dfL += (dl - this.dfL) * 0.35; this.dfR += (dr - this.dfR) * 0.35;
        const fb = 0.46;
        this.dbL[this.dw] = dc + fb * this.dfR;
        this.dbR[this.dw] = fb * this.dfL;
        this.dw = (this.dw + 1) & this.DM;
        const wet = 0.4 * sp.delay;
        let oL = dc + wet * dl, oR = dc + wet * dr;
        if (sp.reverb > 0.002) {
          const x = (oL + oR) * 0.5 * 0.06;
          let rl = 0, rr = 0;
          for (let q = 0; q < 4; q++) {
            let c = this.combL[q], y = c.b[c.i];
            c.f = y * 0.62 + c.f * 0.38; c.b[c.i] = x + c.f * 0.86; if (++c.i >= c.b.length) c.i = 0; rl += y;
            c = this.combR[q]; y = c.b[c.i];
            c.f = y * 0.62 + c.f * 0.38; c.b[c.i] = x + c.f * 0.86; if (++c.i >= c.b.length) c.i = 0; rr += y;
          }
          for (let q = 0; q < 2; q++) {
            let a = this.apL[q], bo = a.b[a.i];
            a.b[a.i] = rl + bo * 0.5; if (++a.i >= a.b.length) a.i = 0; rl = bo - rl;
            a = this.apR[q]; bo = a.b[a.i];
            a.b[a.i] = rr + bo * 0.5; if (++a.i >= a.b.length) a.i = 0; rr = bo - rr;
          }
          const rw = 0.9 * sp.reverb;
          oL += rw * rl; oR += rw * rr;
        }
        ch[i] = oL > 1 ? 1 : oL < -1 ? -1 : oL;
        if (out.length > 1) out[1][i] = oR > 1 ? 1 : oR < -1 ? -1 : oR;
      }

      // denormal guard
      for (let q = 0; q < 4; q++) if (Math.abs(y[q]) < 1e-15) y[q] = 0;
      for (let q = 0; q < 3; q++) if (Math.abs(th[q]) < 1e-15) th[q] = 0;
      if (Math.abs(this.dcY) < 1e-15) this.dcY = 0;

      for (let c = 2; c < out.length; c++) out[c].set(ch);
      if (out.length === 1) { /* mono */ }
      return true;
    }
  }
  registerProcessor('pb303', PB303);
}
if (typeof module !== 'undefined') module.exports = workletMain;
