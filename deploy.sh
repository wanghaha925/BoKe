#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建
echo "开始构建..."
npm run build

# 进入生成的文件夹
cd dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# 请将 <USERNAME> 和 <REPO> 替换为您的用户名和仓库名
git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -

echo "部署完成！"
