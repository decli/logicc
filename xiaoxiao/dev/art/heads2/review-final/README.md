# 全量素材检查

本次检查 219 张；源素材累计 219/219 张。

| 项目 | 结果 |
| --- | --- |
| 文件规格 | 全部1024×1024 RGBA PNG |
| 轮廓留白 | 最小 56 像素，满足至少40像素 |
| 半透明边缘 | 最宽 3 像素 |
| 表情配准 | 118 张衍生表情与对应棋盘脸的alpha逐像素一致 |
| 已认可素材 | 前两批92张内容未改动 |
| 格式与几何错误 | 0 |

表情以对应棋盘脸为依据绘制，导出时保留基础脸的透明轮廓；小手和道具收在头像轮廓内。动作以五官、神态和靠近脸的小道具表达。小黄鸡破壳为独立蛋壳帽轮廓，不纳入表情轮廓一致性统计。

[头像总览](overview.jpg) · [四种底色与85/40/20像素预览](index.html) · [逐图几何及哈希](metrics.json) · [校验汇总](validation.json)

静态预览：[1](preview-01.jpg) · [2](preview-02.jpg) · [3](preview-03.jpg) · [4](preview-04.jpg) · [5](preview-05.jpg) · [6](preview-06.jpg) · [7](preview-07.jpg) · [8](preview-08.jpg) · [9](preview-09.jpg) · [10](preview-10.jpg) · [11](preview-11.jpg) · [12](preview-12.jpg) · [13](preview-13.jpg) · [14](preview-14.jpg) · [15](preview-15.jpg) · [16](preview-16.jpg) · [17](preview-17.jpg) · [18](preview-18.jpg) · [19](preview-19.jpg)。每行右侧是纯色剪影。

主色面积按宽容HSV色系区间估算；剪影比较覆盖同色组棋盘脸。这两项用于定位需人工复看的素材，不替代游戏内辨识检查。详见[colour-metrics.json](colour-metrics.json)和[silhouette-metrics.json](silhouette-metrics.json)。

已指定颜色组的常规角色及其衍生表情，主色色系面积估算均达到60%；6个隐藏款按多色装饰设计单独复看。

当前全部同色组棋盘脸的两两剪影重合度均低于90%。

检查范围为源素材与独立尺寸预览；未运行游戏构建或更新游戏资源引用。

18张黑白组素材的深色中性区域估算均小于一半，最大约36.4%；详见[黑白组面积数据](black-white-metrics.json)。估算使用低饱和度、低明度区间，包含深色五官与纹理。
