#!/usr/bin/env python3
"""Build ZIIION into a single self-contained index.html.

    python3 build.py

src/css/*.css  -> concatenated in filename order into <style>
src/worklet.js -> AudioWorklet DSP (its source text is turned into a Blob at runtime)
src/icons/*    -> app icon (icon-512.png is inlined for the PWA manifest / apple-touch-icon)
src/js/*.js    -> concatenated in filename order inside one IIFE (shared scope)
"""
import base64
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent
src = root / 'src'


def cat(folder, ext):
    return '\n'.join((p.read_text().rstrip('\n')) for p in sorted((src / folder).glob('*' + ext))) + '\n'


css = cat('css', '.css')
app = cat('js', '.js')
icon = 'data:image/png;base64,' + base64.b64encode((src / 'icons' / 'icon-512.png').read_bytes()).decode()
app = app.replace('/*{{ICON}}*/', icon)
worklet = (src / 'worklet.js').read_text()
# drop the node-only export used by the offline test renderer
worklet = re.sub(r"\nif \(typeof module.*\n?", "\n", worklet)

html = (src / 'template.html').read_text()
html = html.replace('/*{{CSS}}*/', css).replace('/*{{WORKLET}}*/', worklet).replace('/*{{APP}}*/', app)
(root / 'index.html').write_text(html)
print('built index.html', len(html), 'bytes')
