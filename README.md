# Full-Featured Video & Content Platform Backend

- [Model link](https://app.eraser.io/workspace/8czR6Kc1FZeu7ZsXhDI3?origin=share)

This is a complete backend application built using **Node.js**, **Express.js**, and **MongoDB**, designed to power a modern video hosting and content-sharing platform. It includes secure authentication, media uploads, user interactions, content organization, and microblogging capabilities — all developed following industry-standard best practices for scalability, maintainability, and security.

---

## Tech Stack

- **Node.js**, **Express.js** – Fast and scalable server-side framework  
- **MongoDB**, **Mongoose** – Flexible and efficient data modeling  
- **JWT + Refresh Tokens** – Stateless and secure authentication  
- **bcrypt** – Password hashing and credential security  
- **Cloudinary** – Image and video uploads with CDN delivery  
- **Multer**, **cookie-parser**, **cors**, **dotenv** – File uploads, cookies, CORS, and config management

---

## Features

The backend supports secure user registration and login with JWT-based authentication and refresh token handling. Users can manage their profile, update account details, change passwords, and upload avatars and cover images. Authentication is handled via HTTP-only cookies for enhanced security.

Video-related functionality includes uploading, editing, deleting, and streaming videos, as well as liking, disliking, commenting, replying, and maintaining a watch history. Users can also create and manage playlists, organize content, and search/filter videos.

A full subscription system allows users to subscribe or unsubscribe from channels, view subscriber/following lists, and track engagement through a dedicated dashboard showing uploads and channel stats.

Additionally, a lightweight microblogging system enables users to post short-form content, interact with tweets through likes and comments, and manage their content seamlessly.

All routes are RESTful, protected with middleware, and return consistent, structured responses through custom API utilities and error handling layers.

---
