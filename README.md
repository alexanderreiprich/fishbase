# fishbase

An app where you can build aquariums and share them with others.

## Prerequisites
- MySQL
- Node.js / npm

## Instructions for local usage

1. Clone repository
2. Install dependencies for both client and server with `npm install` in the respective directories
3. Navigate to server/db/ and run `mysql -u username -p fishbase < setup.sql`
4. Make sure the created database is running
5. Navigate to server/db/ and execute insertImages.js by running `node insertImages.js` to convert the images to blobs and store them in the database
6. Run `npm run start` in both the client and server directories
7. The app is now available on http://localhost:3000/