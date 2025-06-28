# 🚀 GitHub Pages 部署指南

本指南将帮助您将豪华博客部署到GitHub Pages，让您的博客在线可访问。

## 📋 部署前检查清单

### 1. 确保代码已推送到GitHub
```bash
git add .
git commit -m "准备部署到GitHub Pages"
git push origin main
```

### 2. 检查仓库设置
- 仓库必须是公开的（Public）
- 仓库名称应该与 `vite.config.ts` 中的 base 路径匹配

## 🛠️ 部署方法

### 方法一：自动部署（推荐）

#### 1. 启用GitHub Pages
1. 进入您的GitHub仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 下选择 **GitHub Actions**

#### 2. 触发部署
- 推送代码到 `main` 或 `master` 分支会自动触发部署
- 在 **Actions** 标签页可以查看部署进度

#### 3. 访问网站
部署完成后，您的网站将在以下地址可访问：
```
https://<您的用户名>.github.io/luxury-blog/
```

### 方法二：手动部署

#### 1. 修改部署脚本
编辑 `deploy.sh` 文件，将 `<USERNAME>` 和 `<REPO>` 替换为您的实际信息：
```bash
git push -f git@github.com:您的用户名/luxury-blog.git main:gh-pages
```

#### 2. 运行部署脚本
```bash
npm run deploy
```

#### 3. 配置GitHub Pages
1. 进入仓库设置
2. 在 Pages 设置中选择 **Deploy from a branch**
3. 选择 **gh-pages** 分支
4. 选择 **/ (root)** 文件夹

## 🔧 常见问题解决

### 问题1: 页面显示404
**原因**: 路径配置不正确
**解决方案**: 
1. 检查 `vite.config.ts` 中的 base 路径是否与仓库名匹配
2. 确保仓库名为 `luxury-blog`

### 问题2: 路由不工作
**原因**: GitHub Pages 不支持客户端路由
**解决方案**: 
- 已配置为在生产环境使用 hash 路由模式
- 404.html 文件会处理路由重定向

### 问题3: 资源文件404
**原因**: 静态资源路径不正确
**解决方案**: 
- 确保所有静态资源放在 `public` 文件夹中
- 使用相对路径引用资源

### 问题4: 构建失败
**原因**: 依赖或配置问题
**解决方案**: 
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 本地测试构建
npm run build
npm run preview
```

## 📝 部署后配置

### 1. 自定义域名（可选）
如果您有自定义域名：
1. 在 `public` 文件夹中创建 `CNAME` 文件
2. 在文件中写入您的域名，如：`blog.yourdomain.com`
3. 在域名提供商处配置DNS记录

### 2. 环境变量
如果需要配置生产环境变量：
1. 在仓库设置中添加 **Secrets**
2. 在GitHub Actions中使用这些secrets

### 3. 监控部署
- 在 **Actions** 标签页查看部署历史
- 设置邮件通知获取部署状态

## 🎯 优化建议

### 1. 性能优化
- 启用Gzip压缩
- 优化图片大小
- 使用CDN加速

### 2. SEO优化
- 配置正确的meta标签
- 添加sitemap.xml
- 设置robots.txt

### 3. 安全性
- 启用HTTPS（GitHub Pages默认支持）
- 配置安全头部

## 📞 获取帮助

如果遇到部署问题：
1. 检查GitHub Actions的构建日志
2. 查看浏览器控制台的错误信息
3. 参考GitHub Pages官方文档

---

**祝您部署成功！** 🎉
