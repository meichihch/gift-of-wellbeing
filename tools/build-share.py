# 從 index.html（原型，含側欄）產生 share/index.html（分享版，只有手機畫面）。
# 用法：python3 tools/build-share.py
# 分享版做三件事：<html data-share>、<base href="../">（assets/ 在 repo 根目錄）、標題只寫產品名
import os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
assert s.count('<html lang="zh-Hant">') == 1 and s.count('<meta charset="utf-8">') == 1
s = s.replace('<html lang="zh-Hant">', '<html lang="zh-Hant" data-share>')
s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../">\n<meta name="description" content="把心事說給一棵真的樹聽。">\n<meta property="og:title" content="樹洞">\n<meta property="og:description" content="把心事說給一棵真的樹聽。">')
s = s.replace('<title>樹洞 · 互動原型</title>', '<title>樹洞</title>')
os.makedirs(os.path.join(root, 'share'), exist_ok=True)
open(os.path.join(root, 'share', 'index.html'), 'w', encoding='utf-8').write(s)
print('share/index.html updated')
