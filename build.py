#!/usr/bin/env python3
"""Build ZION 303 into a single self-contained index.html.

    python3 build.py

src/css/*.css  -> concatenated in filename order into <style>
src/fonts/*    -> wordmark font (Inter Display, subset), inlined into the CSS as base64
src/worklet.js -> AudioWorklet DSP (its source text is turned into a Blob at runtime)
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
# inline fonts as data URIs so the app stays a single file
def inline_font(m):
    data = base64.b64encode((src / 'fonts' / m.group(1)).read_bytes()).decode()
    return 'url(data:font/woff;base64,' + data + ')'
css = re.sub(r'url\(fonts/([\w.-]+\.woff)\)', inline_font, css)
app = cat('js', '.js')
worklet = (src / 'worklet.js').read_text()
# drop the node-only export used by the offline test renderer
worklet = re.sub(r"\nif \(typeof module.*\n?", "\n", worklet)

html = (src / 'template.html').read_text()
html = html.replace('/*{{CSS}}*/', css).replace('/*{{WORKLET}}*/', worklet).replace('/*{{APP}}*/', app)
out = root / 'index.html'
out.write_text(html)
print('built', out.name, len(html), 'bytes')
