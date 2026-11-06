# 首页改版 · 梦想群岛

2026-11-06 首页改版：先做了三版可点的原型（`a.html` 小画本书架、`b.html` 梦想群岛、`c.html` 玩具盒，`index.html` 把三版放在一起对照，`shared.js` 是三版共用的内容和占位图标），decli 选了 **B · 梦想群岛**，照 `PROMPTS.md` 画了图，现在就是网站的首页（根目录 `index.html` 的 `home()`）。

| 文件 | 是什么 |
| --- | --- |
| `PROMPTS.md` | 给 decli 的画图要求和提示词 |
| `art/` | decli 交的 23 张原图（PNG）：12 张游戏插画、挥手熊猫，`b/` 里是五座岛、海面和帆船、浮标、指南针、云朵；`art/README.md` 是她的交付说明 |
| `art.py` | `python3 dev/home-designs/art.py`：品红底抠掉（边上的半透明毛边把品红「减掉」，不留粉边），缩小压成 WebP 放进根目录的 `home/`，再打印每座岛草地的中心，填进首页的 `MEADOW` |
| `a.html` `b.html` `c.html` `index.html` `shared.js` `img/` | 三版原型，留作记录 |

加一个游戏：照 `PROMPTS.md` 的统一要求画一张 `art/<id>.png`，在 `art.py` 的 `GAMES` 里加上它跑一遍，再在首页的 `ISLES` 里把它放上一座岛（一座岛最多三个），`sw.js` 的 `HOME_ART` 里也加上。
