#!/usr/bin/env python3
"""Build tools/docx/reference.docx: pandoc's default Word styles with every
font set to Times New Roman and every text color removed (plain black).

    python3 tools/docx/make-reference.py
"""
import io, os, re, subprocess, zipfile

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'reference.docx')
default = subprocess.run(['pandoc', '--print-default-data-file', 'reference.docx'],
                         check=True, capture_output=True).stdout

FONT = 'Times New Roman'
src = zipfile.ZipFile(io.BytesIO(default))
buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as dst:
    for item in src.infolist():
        data = src.read(item.filename)
        if item.filename in ('word/styles.xml', 'word/document.xml', 'word/numbering.xml'):
            x = data.decode('utf-8')
            x = re.sub(r'<w:color [^>]*/>', '', x)                      # no colored text
            x = re.sub(r'<w:shd [^>]*/>', '', x)                        # no shaded backgrounds
            x = re.sub(r'<w:rFonts [^>]*/>', '<w:rFonts w:ascii="%s" w:hAnsi="%s" w:eastAsia="%s" w:cs="%s"/>' % ((FONT,) * 4), x)
            # Make sure the document defaults carry the font and black color too.
            x = x.replace('<w:rPrDefault><w:rPr>', '<w:rPrDefault><w:rPr><w:rFonts w:ascii="%s" w:hAnsi="%s" w:eastAsia="%s" w:cs="%s"/><w:color w:val="000000"/>' % ((FONT,) * 4), 1)
            # Links stay black but underlined, so they're still visible.
            x = re.sub(r'(<w:style [^>]*w:styleId="Hyperlink"[^>]*>[\s\S]*?<w:rPr>)', r'\1<w:u w:val="single"/>', x, count=1)
            data = x.encode('utf-8')
        elif item.filename.startswith('word/theme/'):
            x = data.decode('utf-8')
            x = re.sub(r'(<a:(?:latin|ea|cs) typeface=")[^"]*(")', r'\g<1>%s\2' % FONT, x)
            data = x.encode('utf-8')
        dst.writestr(item, data)
open(out, 'wb').write(buf.getvalue())
print('Wrote', out)
