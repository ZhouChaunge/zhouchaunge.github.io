# Changjian Zhou · Academic Homepage

英文个人学术主页，采用简洁单页、个人侧栏和圆润的 Nunito 字体。

- 主页：https://zhouchaunge.github.io/
- 仓库：https://github.com/ZhouChaunge/zhouchaunge.github.io
- 发布来源：main 分支根目录；每次推送后由 GitHub Pages 自动发布。
- 内容包含简介、研究兴趣、论文、开源软件、教育经历、荣誉与公开联系方式。

## 修改内容

1. 编辑 content.js 中的个人资料。普通字符串会自动转义，无需编写 HTML。
2. 如果更新了 CV，请先替换 assets/cv.pdf；PDF 不会随网页构建自动更新。
3. 在仓库目录运行 `node build.mjs`，生成完整的 index.html、robots.txt 和 sitemap.xml，并更新样式、脚本和 CV 的缓存版本。
4. 将内容文件及生成的页面一起提交到 main。

网站使用完整静态 HTML，关闭 JavaScript 也可阅读全部内容。app.js 负责导航高亮和论文筛选；构建只需要 Node.js，无第三方依赖。

## 论文分类与标签

全部论文写在 content.js 的 publications 数组中，预印本与正式论文共用同一份列表。页面按年份倒序排列，同年保留资料文件中的顺序。

- id：稳定且唯一的英文短名，例如 trace；可通过 #pub-trace 直接链接。
- topics：研究方向 id 数组，目前为 physical-ai 或 engineering；交叉研究可填写多个方向，页面只显示一条论文。
- tags：一到两个简短方法／主题标签，例如 Learned Simulation 和 Granular Dynamics。
- status：预印本填写 Preprint；正式发表后修改原条目的 venue、status、links，避免新增重复版本。
- publicationTopics：筛选按钮的 id 和显示名称。按钮数量由论文数据自动统计。

当前七篇论文全部展示。当选中的方向达到十二篇时，默认展示前八篇，提供 Show all / Show fewer。筛选在原列表内进行，不使用内部滚动框。打印时包含全部论文；关闭 JavaScript 时全部内容可直接阅读。

交互检查：运行 `node --test tests/publication-filter.test.mjs`。

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
assets/cv.pdf    公开英文 CV
assets/portrait.jpg   头像
assets/fonts/    Nunito 字体与许可证
robots.txt       搜索引擎抓取配置
sitemap.xml      站点地图
.nojekyll        直接发布静态文件
```

## 信息来源与维护

职业资料参考墨尔本大学官方研究生个人页、本人 ORCID 和个人简历。论文清单以本人 Google Scholar 或 ResearchGate 为准，作者顺序和出版状态参考正式出版、会议及预印本记录核对。预印本仅标注条目状态，页面不按发表状态分区。新增论文时请核对完整作者顺序和正式链接。

Google Scholar：https://scholar.google.com/citations?user=t6bjRe0AAAAJ&hl=en

公开 CV 仅包含学术履历和职业联系方式。原始简历及本地个人材料不属于本站文件。

布局参考 [Minimal Light](https://github.com/yaoyao-liu/minimal-light)，为独立轻量实现。Nunito 来自 [Google Fonts 官方仓库](https://github.com/google/fonts/tree/main/ofl/nunito)，字体许可证保存在 assets/fonts/OFL.txt。
