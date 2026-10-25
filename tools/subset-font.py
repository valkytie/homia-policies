#!/usr/bin/env python3
"""Build or validate the homepage-only Noto Serif TC 500 WOFF2 subset."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'assets/fonts/noto-serif-tc-500.woff2'
MANIFEST = ROOT / 'tools/font-manifest.json'
SOURCE_URL = 'https://raw.githubusercontent.com/notofonts/noto-cjk/Serif2.003/Serif/SubsetOTF/TC/NotoSerifTC-Medium.otf'
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}


class SerifText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        classes = set(dict(attrs).get('class', '').split())
        selected = tag in {'h1', 'h2', 'h3', 'figcaption'} or bool(classes & {'letter-meta', 'letter-signature', 'faq-group'})
        if tag not in VOID:
            self.stack.append((tag, selected))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if any(selected for _, selected in self.stack):
            self.text.append(data)


def required_codepoints():
    parser = SerifText()
    parser.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    punctuation = '「」『』（）・—／·。，、：；？！↗↓↑−'
    return sorted({ord(char) for char in ''.join(parser.text) + punctuation} | set(range(32, 127)))


def validate(font, codepoints):
    missing = set(codepoints) - set(font.getBestCmap())
    if missing:
        raise ValueError('Font is missing codepoints: ' + ', '.join(f'U+{v:04X}' for v in sorted(missing)))


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('source', nargs='?', type=Path, help='Official NotoSerifTC-Medium.otf version 2.003')
    args.add_argument('--check', action='store_true', help='Validate existing subset without modifying files')
    options = args.parse_args()
    codepoints = required_codepoints()
    if options.check:
        font = TTFont(OUTPUT)
        validate(font, codepoints)
        manifest = json.loads(MANIFEST.read_text())
        if hashlib.sha256(OUTPUT.read_bytes()).hexdigest() != manifest['sha256']:
            raise ValueError('Font bytes do not match the recorded manifest.')
    else:
        if options.source is None:
            args.error('Provide the official source font, or use --check.')
        font = TTFont(options.source, recalcTimestamp=False)
        version = font['name'].getDebugName(5)
        if not version.startswith('Version 2.003;'):
            raise ValueError('Expected pinned Noto Serif TC version 2.003.')
        validate(font, codepoints)
        settings = subset.Options()
        settings.flavor = 'woff2'
        settings.recalc_timestamp = False
        settings.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
        worker = subset.Subsetter(options=settings)
        worker.populate(unicodes=codepoints)
        worker.subset(font)
        font.flavor = 'woff2'
        OUTPUT.parent.mkdir(exist_ok=True, parents=True)
        font.save(OUTPUT)
        validate(TTFont(OUTPUT), codepoints)
        manifest = {
            'family': 'Noto Serif TC Medium', 'version': version,
            'source_url': SOURCE_URL,
            'source_sha256': hashlib.sha256(options.source.read_bytes()).hexdigest(),
            'license': 'SIL Open Font License 1.1; see OFL.txt',
            'sha256': hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
            'codepoints': sorted(TTFont(OUTPUT).getBestCmap()),
        }
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if OUTPUT.stat().st_size > 180 * 1024:
        raise ValueError('Homepage subset exceeds the 180 KiB budget.')
    print(f'Font coverage verified: {len(codepoints)} required codepoints, {OUTPUT.stat().st_size} bytes.')


if __name__ == '__main__':
    main()
