# Express Blog API

A modern RESTful blog API built with Node.js, Express, and Prisma.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

## 🚀 Features

- User authentication & authorization
- CRUD operations for blog posts
- Nested comments system
- PostgreSQL with Prisma ORM
- JWT token-based auth
- Input validation

## 💻 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JSON Web Tokens
- Joi Validation

## ⚙️ Installation

\```bash

# Clone repository

git clone https://github.com/yourusername/express-blog-api.git
cd express-blog-api

# Install dependencies

npm install

# Initialize Prisma

npx prisma generate
npx prisma db push

# Start server

npm run dev
\```

## 📝 API Documentation

### Authentication

\```http
POST /users/register
Content-Type: application/json

{
"name": "string",
"email": "string",
"password": "string"
}

POST /users/login
Content-Type: application/json

{
"email": "string",
"password": "string"
}
\```

### Posts

\```http
GET /posts # Get all posts
POST /posts # Create post
GET /posts/:id # Get single post
PUT /posts/:id # Update post
DELETE /posts/:id # Delete post
\```

### Comments

\```http
POST /posts/:postId/comments # Create comment
GET /posts/:postId/comments # Get post comments
GET /comments/:id # Get comment
PATCH /comments/:id # Update comment
DELETE /comments/:id # Delete comment
\```

## 📊 Database Schema

\```prisma
model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String
posts Post[]
comments Comment[]
}

model Post {
id Int @id @default(autoincrement())
title String
content String
author User @relation(fields: [authorId], references: [id])
authorId Int
comments Comment[]
}

model Comment {
id Int @id @default(autoincrement())
content String
author User @relation(fields: [authorId], references: [id])
authorId Int
post Post @relation(fields: [postId], references: [id])
postId Int
}
\```

## 📁 Project Structure

\```
express-blog-api/
├── prisma/
│ └── schema.prisma
├── routes/
│ ├── user.routes.js
│ ├── post.routes.js
│ └── comment.routes.js
├── middleware/
│ └── auth.js
├── index.js
└── package.json
\```

## 📜 License

MIT

---

Made with ❤️ using Node.js & Express
