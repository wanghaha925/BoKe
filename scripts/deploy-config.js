// 部署配置脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检测部署环境
const deployTarget = process.env.DEPLOY_TARGET || 'development';
const customDomain = process.env.CUSTOM_DOMAIN;

console.log(`🚀 部署目标: ${deployTarget}`);
console.log(`🌐 自定义域名: ${customDomain || '未设置'}`);

// 根据部署目标设置base路径
let basePath = '/';

switch (deployTarget) {
  case 'GITHUB_PAGES':
    basePath = '/BoKe/';
    break;
  case 'CUSTOM_DOMAIN':
    basePath = '/';
    break;
  default:
    basePath = '/';
}

console.log(`📁 Base路径: ${basePath}`);

// 更新vite配置
const viteConfigPath = path.join(__dirname, '../vite.config.ts');
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

// 替换base配置
const baseRegex = /base:\s*.*?,/;
const newBaseConfig = `base: '${basePath}',`;
viteConfig = viteConfig.replace(baseRegex, newBaseConfig);

fs.writeFileSync(viteConfigPath, viteConfig);
console.log(`✅ 已更新vite.config.ts的base路径为: ${basePath}`);

// 如果有自定义域名，创建CNAME文件
if (customDomain && deployTarget === 'CUSTOM_DOMAIN') {
  const cnamePath = path.join(__dirname, '../public/CNAME');
  fs.writeFileSync(cnamePath, customDomain);
  console.log(`✅ 已创建CNAME文件: ${customDomain}`);
}
