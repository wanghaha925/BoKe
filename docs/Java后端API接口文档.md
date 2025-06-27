# Java 后端 API 接口文档

本文档描述了豪华博客系统的后端 API 接口规范，为 Java 后端开发提供详细的接口定义。

## 📋 目录
1. [通用规范](#通用规范)
2. [认证接口](#认证接口)
3. [文章接口](#文章接口)
4. [分类接口](#分类接口)
5. [标签接口](#标签接口)
6. [文件上传接口](#文件上传接口)
7. [统计接口](#统计接口)
8. [错误处理](#错误处理)

## 🔧 通用规范

### 基础URL
```
http://localhost:8080/api
```

### 请求头
```http
Content-Type: application/json
Authorization: Bearer {token}  # 需要认证的接口
```

### 响应格式
所有接口都返回统一的响应格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "code": 200,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### 分页响应格式
```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  },
  "message": "获取成功",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### 错误响应格式
```json
{
  "success": false,
  "message": "错误描述",
  "code": 400,
  "details": {},
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## 🔐 认证接口

### 1. 用户登录
```http
POST /api/auth/login
```

**请求体：**
```json
{
  "username": "admin",
  "password": "admin123",
  "rememberMe": false
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 86400
  }
}
```

### 2. 用户登出
```http
POST /api/auth/logout
```

**请求头：**
```http
Authorization: Bearer {token}
```

**响应：**
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 3. 获取用户信息
```http
GET /api/auth/profile
```

**请求头：**
```http
Authorization: Bearer {token}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

### 4. 修改密码
```http
POST /api/auth/change-password
```

**请求头：**
```http
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

**响应：**
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

## 📝 文章接口

### 1. 获取文章列表
```http
GET /api/posts
```

**查询参数：**
- `page` (int): 页码，默认1
- `pageSize` (int): 每页数量，默认10
- `category` (string): 分类筛选
- `tags` (string): 标签筛选，多个用逗号分隔
- `search` (string): 搜索关键词
- `featured` (boolean): 是否精选
- `author` (string): 作者筛选
- `sortBy` (string): 排序字段 (publishedAt, updatedAt, title)
- `sortOrder` (string): 排序方向 (asc, desc)

**响应：**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1",
        "title": "文章标题",
        "slug": "article-slug",
        "excerpt": "文章摘要",
        "content": "文章内容",
        "author": "作者名",
        "publishedAt": "2024-01-20",
        "updatedAt": "2024-01-20",
        "category": "technology",
        "tags": ["Vue.js", "前端"],
        "coverImage": "https://example.com/image.jpg",
        "readTime": 8,
        "featured": true
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### 2. 获取单篇文章
```http
GET /api/posts/{id}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "文章标题",
    "slug": "article-slug",
    "excerpt": "文章摘要",
    "content": "文章内容",
    "author": "作者名",
    "publishedAt": "2024-01-20",
    "updatedAt": "2024-01-20",
    "category": "technology",
    "tags": ["Vue.js", "前端"],
    "coverImage": "https://example.com/image.jpg",
    "readTime": 8,
    "featured": true
  }
}
```

### 3. 根据slug获取文章
```http
GET /api/posts/slug/{slug}
```

### 4. 创建文章
```http
POST /api/posts
```

**请求头：**
```http
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "excerpt": "文章摘要",
  "content": "文章内容",
  "author": "作者名",
  "category": "technology",
  "tags": ["Vue.js", "前端"],
  "coverImage": "https://example.com/image.jpg",
  "featured": false
}
```

### 5. 更新文章
```http
PUT /api/posts/{id}
```

**请求头：**
```http
Authorization: Bearer {token}
```

**请求体：** 同创建文章

### 6. 删除文章
```http
DELETE /api/posts/{id}
```

**请求头：**
```http
Authorization: Bearer {token}
```

## 📂 分类接口

### 1. 获取分类列表
```http
GET /api/categories
```

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "技术",
      "slug": "technology",
      "description": "技术相关文章",
      "count": 10
    }
  ]
}
```

### 2. 创建分类
```http
POST /api/categories
```

**请求头：**
```http
Authorization: Bearer {token}
```

**请求体：**
```json
{
  "name": "分类名称",
  "slug": "category-slug",
  "description": "分类描述"
}
```

### 3. 更新分类
```http
PUT /api/categories/{id}
```

### 4. 删除分类
```http
DELETE /api/categories/{id}
```

## 🏷️ 标签接口

### 1. 获取标签列表
```http
GET /api/tags
```

### 2. 获取热门标签
```http
GET /api/tags/popular
```

## 📁 文件上传接口

### 1. 上传图片
```http
POST /api/upload/image
```

**请求头：**
```http
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**请求体：**
```
file: (binary)
```

**响应：**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg"
  }
}
```

## 📊 统计接口

### 1. 获取博客统计
```http
GET /api/stats/blog
```

**请求头：**
```http
Authorization: Bearer {token}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "totalPosts": 50,
    "totalCategories": 5,
    "totalTags": 20,
    "totalViews": 10000,
    "featuredPosts": 5,
    "publishedPosts": 45,
    "draftPosts": 5
  }
}
```

## ❌ 错误处理

### HTTP状态码
- `200` - 成功
- `201` - 创建成功
- `204` - 删除成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源不存在
- `409` - 资源冲突
- `422` - 数据验证失败
- `500` - 服务器内部错误

### 错误代码
```json
{
  "INVALID_CREDENTIALS": "用户名或密码错误",
  "TOKEN_EXPIRED": "登录已过期",
  "TOKEN_INVALID": "无效的认证令牌",
  "POST_NOT_FOUND": "文章不存在",
  "SLUG_ALREADY_EXISTS": "URL别名已存在",
  "VALIDATION_ERROR": "数据验证失败",
  "FILE_TOO_LARGE": "文件过大",
  "INVALID_FILE_TYPE": "不支持的文件类型"
}
```

## 🔧 Java 后端实现建议

### 技术栈推荐
- **框架**: Spring Boot 3.x
- **数据库**: MySQL 8.0 / PostgreSQL
- **ORM**: Spring Data JPA / MyBatis-Plus
- **认证**: Spring Security + JWT
- **文档**: Swagger/OpenAPI 3
- **缓存**: Redis
- **文件存储**: 本地存储 / 阿里云OSS / AWS S3

### 项目结构建议
```
src/main/java/com/luxuryblog/
├── controller/          # 控制器层
├── service/            # 业务逻辑层
├── repository/         # 数据访问层
├── entity/             # 实体类
├── dto/                # 数据传输对象
├── config/             # 配置类
├── security/           # 安全配置
├── exception/          # 异常处理
└── util/               # 工具类
```

### 数据库表设计
```sql
-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    author VARCHAR(100),
    category_id BIGINT,
    cover_image VARCHAR(255),
    read_time INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    published_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 标签表
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章标签关联表
CREATE TABLE post_tags (
    post_id BIGINT,
    tag_id BIGINT,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## 🚀 部署配置

### 环境变量
```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/luxury_blog
spring.datasource.username=root
spring.datasource.password=password

# JWT配置
jwt.secret=your-secret-key
jwt.expiration=86400

# 文件上传配置
file.upload.path=/uploads
file.upload.max-size=10MB

# Redis配置
spring.redis.host=localhost
spring.redis.port=6379
```

这个API文档为您的Java后端开发提供了完整的接口规范。前端已经按照这些接口进行了设计，您只需要按照文档实现对应的后端接口即可实现前后端的完美对接。
