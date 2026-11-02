# 动物消消乐 · 第二季「动物环游世界」素材提示词

> decli 2026-11-02 已全部画好：原图（WebP）和实际用的提示词在 `season2/`，`python3 xiaoxiao/dev/art2.py` 处理成页面用的图。
> 要换哪一张，照下面的要求重画、同名放进 `season2/`（PNG 也行，会优先用 PNG），再跑一次 `art2.py`。

一共 **16 张图**：4 张棋盘上的新东西（蛋、气球、笼子三张透明底，加一张草地底纹）、6 张岛屿小图标、6 张岛屿地图背景。
没画好之前，游戏里先用代码画的简单版本，画好一张换一张，不影响玩。

画好的图放进 `xiaoxiao/dev/art/season2/`，按下面的文件名命名（或者直接发给我，我来放）。

## 统一的风格（每条提示词前面都加上这一段）

> 和我之前画的那 70 个动物头像同一套风格：软糖 / 黏土质感的 3D 卡通，圆润饱满，表面有柔和的光泽和高光，
> 光从左上方来，颜色明亮的马卡龙色，可爱、干净，没有黑色描边，没有文字，没有水印。

英文版（有的画图工具英文更好用）：

> Same style as my set of 70 cute animal heads: glossy soft 3D clay / gummy-candy look, rounded and plump,
> soft studio lighting from the top-left with gentle specular highlights, bright pastel macaron colours,
> kawaii and clean, no black outlines, no text, no watermark.

**透明底**：小图和岛屿图标都要透明背景的 PNG。画图工具做不到透明的话，用一种画里绝对没有的纯色铺满背景
（蛋、气球、笼子用纯深蓝 `#1E3A8A`，岛屿图标用纯品红 `#FF00FF`），我来抠掉。

---

## 一、棋盘上的新东西（4 张）

它们在棋盘上只有一个格子那么大（平板上大约 80 像素），所以**形状要简单、一眼认得出**，细节不要太碎。

### 1. `eggs.png` · 蛋宝宝（一张图里左右两个蛋）

- 尺寸 2048 × 1024，透明底；左边一个完整的蛋，右边**同一个蛋**裂开了，两个蛋之间留宽宽的空白、不要挨着
- 玩法：小动物在蛋旁边消一次，蛋裂开（右边那个）；再消一次，蹦出一只小黄鸡（用已有的小黄鸡头像）

> 【风格段】Two cute eggs side by side on a transparent background, 2048×1024, each egg filling about 80% of the
> height, centred in its own half with wide empty space between them. Left: a whole plump egg, cream-white shell
> with a few pastel pink and mint green polka dots, standing upright, front view. Right: exactly the same egg with a
> big zigzag crack across its middle, the top slightly lifted, a tiny bit of fluffy yellow peeking out of the crack.
> No nest, no ground, no shadow underneath.

### 2. `balloon.png` · 气球

- 尺寸 1024 × 1024，透明底；一个气球，下面一小段弯弯的绳子，整体在正方形里居中，球占上面大约四分之三
- 玩法：气球在棋盘上往**上**飘，飘出顶上就飞走了

> 【风格段】A single cute round balloon on a transparent background, 1024×1024, glossy candy-pink, a big soft
> highlight on the upper left and a tiny white heart-shaped shine, a small knot at the bottom and a short curly white
> string hanging below. The balloon fills the top three quarters of the square, centred. Front view, no shadow.

### 3. `cage.png` · 彩色笼子

- 尺寸 1024 × 1024，透明底；一个圆角方形的小笼子，**中间必须是空的、透明的**（小动物会画在笼子后面，要从栏杆缝里看得见）
- 笼子正下方挂一个**空白的圆形小锁牌**，上面什么都不要画（游戏会在锁牌上放那种小动物的头像，表示要它来开锁）

> 【风格段】A cute rounded-square cage frame on a transparent background, 1024×1024, filling about 90% of the
> square: a soft rounded frame and four thin vertical bars, glossy pearly white with warm gold accents. The inside of
> the cage is completely empty and transparent so whatever is behind it shows between the bars. A round blank badge
> shaped like a little padlock hangs at the bottom centre of the frame, plain and empty with nothing drawn on it.
> Front view, no shadow, no background.

### 4. `grass.png` · 草地底纹

- 尺寸 512 × 512，**不要透明**，铺满整张；可以无缝拼接（左右、上下接起来看不出接缝）
- 玩法：在哪儿消，哪儿的格子就长出草，目标是把整个棋盘种绿。小动物会站在草上，所以草要**颜色柔和、对比度低**，不能抢小动物的风头

> 【风格段, but flat】A seamless tileable square texture, 512×512, top-down view of soft short lush grass in a fresh
> light spring green, gentle low contrast, with two or three tiny white and yellow flowers scattered sparsely. Even
> lighting, no shadows, no perspective, fills the whole square, edges match when tiled.

---

## 二、岛屿小图标（6 张）

用在地图顶上、岛屿之间切换、整座岛通关的庆祝卡片上。每张 1024 × 1024，透明底，**一座漂浮的小岛**（斜 45 度俯视，
下面是一块圆圆的泥土岩石底），岛上是这座岛的标志，不要动物，不要文字。

六座岛共用的说明：

> 【风格段】A small cute floating island on a transparent background, 1024×1024, seen from a three-quarter top
> view, a rounded chunk of earth and rock underneath, the whole island centred and filling about 85% of the
> square. No animals, no people, no text.

后面接上每座岛自己的内容：

| 文件名 | 岛名 | 接在后面的英文 |
| --- | --- | --- |
| `island-1.png` | 动物乐园（现在的十关） | On top: a sunny candy meadow with a tiny colourful carousel, two lollipop trees and a few round bushes. |
| `island-2.png` | 蛋蛋农场 | On top: a little red barn with a white roof, a haystack, a short wooden fence, a straw nest holding three pastel eggs, two sunflowers. |
| `island-3.png` | 花花草原 | On top: rolling bright green hills covered in small flowers, a tiny white windmill, a couple of butterflies. |
| `island-4.png` | 云朵气球岛 | On top: fluffy white clouds wrapped around the island, two small hot-air balloons in pastel stripes, a small rainbow arc. |
| `island-5.png` | 森林营救 | On top: a friendly lush jungle with round trees, giant spotted mushrooms, a little waterfall and a small empty wooden cage with its door open. |
| `island-6.png` | 彩虹城堡 | On top: a small pastel castle with round towers, a rainbow over it, an icy blue tower and a few wrapped gift boxes. |

---

## 三、岛屿地图背景（6 张）

每座岛进去以后，15 个关卡按钮和连接它们的路由游戏自己画在背景上面，所以：

- 尺寸 **2400 × 1600**（横向 3:2），不要透明，JPG 或 PNG 都行
- **中间大块（左右各留 15%、上下各留 18% 之外的区域）要空旷平坦**：平整的草地 / 沙地 / 云面，细节少，
  颜色稍微淡一点，这样按钮和路才清楚；**不要画小路、道路、按钮或任何文字**
- 好看的东西（树、房子、装饰）都放在**四条边和四个角**上
- 不同屏幕会从四周裁掉一点，重要的东西不要贴边

> 【风格段】A soft pastel game map background, 2400×1600 landscape, top-down slightly tilted view. The large
> central area is open, flat and simple with very little detail and slightly lighter colours (it will hold a
> winding path and 15 level buttons drawn by the game later). All the decorations sit around the four edges and
> corners, kept away from the very border. No roads, no paths, no buttons, no text, no characters.

后面接上每座岛自己的内容（文件名 `island-1-bg.png` … `island-6-bg.png`）：

| 文件名 | 接在后面的英文 |
| --- | --- |
| `island-1-bg.png` | Theme: a candy meadow park — pale green grass in the middle, lollipop trees, round bushes, a small carousel and balloons at the edges. |
| `island-2-bg.png` | Theme: a farm — soft light-green field in the middle, a red barn, haystacks, wooden fences, nests with eggs and sunflowers at the edges. |
| `island-3-bg.png` | Theme: a flower prairie — gentle light grass in the middle, flower patches in many colours, a windmill, butterflies at the edges. |
| `island-4-bg.png` | Theme: a sky island — a wide soft cloud floor in the middle, hot-air balloons, rainbows and fluffy clouds at the edges, pale blue sky. |
| `island-5-bg.png` | Theme: a friendly jungle — a soft mossy clearing in the middle, round jungle trees, giant mushrooms, ferns and a waterfall at the edges. |
| `island-6-bg.png` | Theme: a rainbow castle — a pale pastel courtyard in the middle, castle towers, an ice tower, gift boxes and rainbow arches at the edges. |

---

## 检查清单

- [ ] 3 张透明底小图：`eggs.png`（一张里左右两个蛋）、`balloon.png`、`cage.png`（中间透明、锁牌空白）；1 张 `grass.png`（不透明、能无缝拼）
- [ ] 6 张透明底岛屿图标 `island-1.png` … `island-6.png`
- [ ] 6 张 2400 × 1600 背景 `island-1-bg.png` … `island-6-bg.png`（中间空旷、没有路和字）
