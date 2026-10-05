# Zhou Changjian · Academic Homepage

英文个人学术主页，采用 Minimal Light 风格的简洁双栏及圆润的 Nunito 字体。纯静态网站，无需安装框架或构建依赖。

- 网站地址：https://zhouchaunge.github.io/
- GitHub 仓库：https://github.com/ZhouChaunge/zhouchaunge.github.io
- 发布来源：`main` 分支的根目录，GitHub Pages 自动发布每次提交。

## 修改个人资料

主要编辑 `content.js`：姓名、身份、所属机构、简介、研究方向、联系方式、学术链接和论文。头像和 CV 文件放在 `assets/` 下，再填入对应相对路径，例如 `./assets/portrait.jpg` 或 `./assets/cv.pdf`。

姓名、所属机构、城市及 GitHub 链接来自用户提供的 GitHub 公开资料。身份、研究方向、论文和联系方式未提供，当前仍是带明确提示的草稿，未编造履历。

## 正式版上线

1. 补齐或删去所有方括号占位内容，上传自己的头像和简历。
2. 将 `content.js` 中的 `draft` 改为 `false`。
3. 同步更新 `index.html` 中的简介及静态文字，并删除 `<meta name="robots" content="noindex, nofollow">`。
4. 提交到 `main`；在 GitHub 仓库的 Actions 中查看发布状态。

草稿的 `noindex` 只向搜索引擎提出不收录请求，不是访问控制；GitHub Pages 网站公开可访问。

## 本地预览

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

访问 http://127.0.0.1:4173/ 。

## 文件结构

```text
index.html       页面结构与静态文字
styles.css       布局与字体
content.js       个人资料和论文
app.js           渲染与导航
assets/fonts/    Nunito 字体与许可证
.nojekyll        直接发布静态文件
```

本项目为原创轻量实现，布局参考 [Minimal Light](https://github.com/yaoyao-liu/minimal-light)，并非其源码 fork。Nunito 来自 [Google Fonts 官方仓库](https://github.com/google/fonts/tree/main/ofl/nunito)，字体许可证保存在 `assets/fonts/OFL.txt`。
