# Changjian Zhou · Academic Homepage

英文个人学术主页，采用简洁单页、个人侧栏和圆润的 Nunito 字体。

- 主页：https://zhouchaunge.github.io/
- 仓库：https://github.com/ZhouChaunge/zhouchaunge.github.io
- 发布来源：main 分支根目录；每次推送后由 GitHub Pages 自动发布。
- 内容包含简介、研究兴趣、论文、开源软件、教育经历、荣誉与公开联系方式。

## 修改内容

1. 编辑 content.js 中的个人资料。普通字符串会自动转义，无需编写 HTML。
2. 在仓库目录运行 `node build.mjs`，生成完整的 index.html、robots.txt 和 sitemap.xml。
3. 如果更新了 CV，请同时替换 assets/cv.pdf；PDF 不会随网页构建自动更新。
4. 将内容文件及生成的页面一起提交到 main。

网站使用完整静态 HTML，关闭 JavaScript 也可阅读全部内容。app.js 仅负责导航高亮，不影响正文显示。构建只需要 Node.js，无第三方依赖。

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
app.js           导航高亮
assets/cv.pdf    公开英文 CV
assets/portrait.jpg   头像
assets/fonts/    Nunito 字体与许可证
robots.txt       搜索引擎抓取配置
sitemap.xml      站点地图
.nojekyll        直接发布静态文件
```

## 信息来源与维护

职业资料参考墨尔本大学官方研究生个人页、本人 ORCID、公开论文出版页和个人简历。论文按正式出版或会议记录列出；尚无完整出版信息的 KAN-GSA 单列为 accepted manuscript，不填未确认的年份、DOI 或合著者名单。新增论文时请核对完整作者顺序和正式链接。

公开 CV 仅包含学术履历和职业联系方式。原始简历及本地个人材料不属于本站文件。

布局参考 [Minimal Light](https://github.com/yaoyao-liu/minimal-light)，为独立轻量实现。Nunito 来自 [Google Fonts 官方仓库](https://github.com/google/fonts/tree/main/ofl/nunito)，字体许可证保存在 assets/fonts/OFL.txt。
