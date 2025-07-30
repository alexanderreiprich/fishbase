# fishbase

An app where you can build aquariums and share them with others.

## Prerequisites

- MySQL
- Node.js / npm

## Instructions for local usage

1. Clone repository
2. Install dependencies for both client and server with `npm install` in the respective directories
3. Navigate to server/db/ and run `mysql -u root -p fishbase < setup.sql`
   you might have to remove 'fishbase' from command to create the database
4. Make sure the created database is running
   by logging into mysql `mysql -u root -p`
   and entering SHOW PROCESSLIST you can check if fishbase exists
5. Navigate to server/db/ and edit the database details inside insertImages.js
6. Execute insertImages.js by running `node insertImages.js` to convert the images to blobs and store them in the database

7. add database details to /server/.env file as follows:
   MYSQLHOST=<localhost>
   MYSQLPORT=<port>
   MYSQLUSER=<user>
   MYSQLPASSWORD=<password>
   MYSQLDATABASE=<fishbase>
   JWT_SECRET=<jwt>;

8. execute 'addImgs' script in server/package.json `node --env-file=.env db/inserImages.js` to add images

9. Run `npm run start` in both the client and server directories
10. The app is now available on http://localhost:3000/
