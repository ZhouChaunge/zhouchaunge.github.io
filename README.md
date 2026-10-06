# Changjian Zhou · Academic Homepage

英文个人学术主页，采用简洁单页、个人侧栏和圆润的 Nunito 字体。

- 主页：https://zhouchaunge.github.io/
- 仓库：https://github.com/ZhouChaunge/zhouchaunge.github.io
- 发布来源：main 分支根目录；每次推送后由 GitHub Pages 自动发布。
- 主区块顺序：About Me → Education & Experience → Research Interests → Publications → Selected Honors → Research Collaborations。开源软件保留在论文区的展开面板中，联系方式位于个人侧栏和页尾。

## 修改内容

1. 编辑 content.js 中的个人资料。普通字符串会自动转义，无需编写 HTML。
2. 如果更新了 CV，请先替换 assets/cv.pdf；PDF 不会随网页构建自动更新。
3. 在仓库目录运行 `node build.mjs`，生成完整的 index.html、robots.txt 和 sitemap.xml，并更新样式、脚本、头像、论文媒体和 CV 的缓存版本。
4. 将内容文件及生成的页面一起提交到 main。

网站使用完整静态 HTML，主要学术内容无需 JavaScript 即可阅读。app.js 负责导航高亮和论文筛选，collaboration-map.js 负责地图地点浮层；构建只需要 Node.js，无第三方依赖。

## 教育、工作与头像

experience 中每一条记录的 type 填写 Education、Research 或 Industry，显示为轻量气泡；employment 可选，例如 Full-time。日期使用 years 字段，描述使用 role 和 detail。公开职业资料的来源记录在 docs/profile-sources.md。

机构 logo 可通过每条经历的 logo.src 设置，图片保存在 assets/institutions/。默认按原比例完整显示；横向标志使用 layout: "wordmark"，官方清华宽白底原图使用 layout: "wide-canvas" 仅收起两侧空白。图片与相邻机构名称重复，使用空 alt 避免屏幕阅读器重复朗读。来源及墨大保留文字的原因记录在 docs/logo-sources.md。

头像使用 assets/headshot.jpg（用户提供的原图），以较大的圆形显示，保留原图的完整垂直取景，不额外放大人脸；圆形边缘会遮住画面四角。以后替换文件并重新构建即可。

## 论文分类与标签

全部论文写在 content.js 的 publications 数组中，预印本与正式论文共用同一份列表。页面按年份倒序排列，同年保留资料文件中的顺序。

- id：稳定且唯一的英文短名，例如 trace；可通过 #pub-trace 直接链接。
- topics：研究方向 id 数组，目前为 physical-ai 或 engineering；交叉研究可填写多个方向，页面只显示一条论文。
- tags：一到两个简短方法／主题标签，例如 Learned Simulation 和 Granular Dynamics。
- status：预印本填写 Preprint；正式发表后修改原条目的 venue、status、links，避免新增重复版本。
- publicationTopics：筛选按钮的 id 和显示名称。按钮数量由论文数据自动统计。

当前七篇论文全部展示。当选中的方向达到十二篇时，默认展示前八篇，提供 Show all / Show fewer。筛选在原列表内进行，不使用内部滚动框。打印时包含全部论文；关闭 JavaScript 时全部内容可直接阅读。

全部交互和渲染检查：运行 `node --test tests/*.test.mjs`。

## 论文图片与视频

每篇论文左侧可以显示图片或视频。把媒体放进 assets/publications/，在对应论文中添加 media。图片会延迟加载；视频带原生播放控件，不自动播放。没有媒体时显示可点击的文字卡片，shortTitle 可设置简短标题。

图片示例：

```js
media: {
  type: 'image',
  src: './assets/publications/example.png',
  alt: 'A concise description of the research figure'
}
```

视频示例（支持 mp4、webm、ogv）：

```js
media: {
  type: 'video',
  src: './assets/publications/example.mp4',
  poster: './assets/publications/example-poster.png',
  alt: 'Granular simulation demonstration',
  caption: 'A short description of the demonstration'
}
```

有语音的视频还应设置 `hasSpokenAudio: true`，并添加 `captions: { src: './assets/publications/example.vtt', srclang: 'en', label: 'English' }`。筛选隐藏论文时会暂停视频。已使用图片的来源与许可记录在 docs/media-sources.md。

## 合作地图

collaborations.home 为当前机构所在地，也可以通过 institutions 列出本校合作者；locations 为其他共同作者机构所在地，使用城市级经纬度。每位 collaborator 的 paperIds 关联现有论文 id。

每篇 publication 的 authorship 包含 firstAuthors 和 correspondingAuthors，姓名必须与 authors 一致，共同一作或共同通讯填写全部姓名。本人为一作时，地图包含所有其他作者；本人为共同作者时，只包含一作（含共同一作）与通讯作者，按人去重。构建会验证名单、过滤不符合规则的关联，并在缺少必需合作者时中止，避免新增论文后静默漏人。未核实的通讯身份不填写，也不根据末位作者推断。

作者可按论文分别关联不同机构，同一篇论文也可保留多个机构。Research Collaborations 默认只展示地图；移到或聚焦地点时浮出城市和机构，手机可点击查看。页面不显示作者姓名、身份气泡或常驻的机构／论文卡片。作者数据与筛选规则继续用于验证机构选择，详细核对记录保留在维护文档。原始数据由 lib/collaboration-selection.mjs 转换后交给地图渲染器。

地图使用本地 Natural Earth 地理数据，无运行时地图 API。地图上的地点支持鼠标、键盘和触屏操作；机构信息出现在浮层中，地图下方不再显示城市按钮和详情列表。地图代表共同作者的机构，不表示正式校际合作关系。字段示例和事实依据见 docs/map-sources.md。

## 本地预览

```powershell
node build.mjs
python -m http.server 4173 --bind 127.0.0.1
```

访问 http://127.0.0.1:4173/ 。

## 文件结构

```text
content.js       个人资料、论文和项目的主数据
build.mjs        生成静态页面
index.html       已生成的完整页面
styles.css       布局与字体
app.js           导航高亮、论文筛选与展开
collaboration-map.css / .js   地图样式与交互
lib/             论文媒体和合作地图的静态渲染
assets/cv.pdf    公开英文 CV
assets/headshot.jpg   用户提供的头像
assets/publications/  论文图片、视频和来源许可
assets/map/      本地地图地理数据和来源
assets/fonts/    Nunito 字体与许可证
robots.txt       搜索引擎抓取配置
sitemap.xml      站点地图
.nojekyll        直接发布静态文件
```

## 信息来源与维护

职业资料参考本人 LinkedIn、ResearchGate、墨尔本大学官方研究生个人页、本人 ORCID 和个人简历。论文清单以本人 Google Scholar 或 ResearchGate 为准，作者顺序和出版状态参考正式出版、会议及预印本记录核对。预印本仅标注条目状态，页面不按发表状态分区。新增论文时请核对完整作者顺序和正式链接。

Google Scholar：https://scholar.google.com/citations?user=t6bjRe0AAAAJ&hl=en

公开 CV 仅包含学术履历和职业联系方式。原始简历及本地个人材料不属于本站文件。

布局参考 [Minimal Light](https://github.com/yaoyao-liu/minimal-light)，为独立轻量实现。Nunito 来自 [Google Fonts 官方仓库](https://github.com/google/fonts/tree/main/ofl/nunito)，字体许可证保存在 assets/fonts/OFL.txt。
