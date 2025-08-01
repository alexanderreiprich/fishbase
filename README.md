# fishbase

A web app where you can configure fishtanks, and share them with others.
There is a selection of fish, invertibrate and plants to choose from. While selecting your next Inhabitants you can see which ones are compatible with each other, or if there might be conflicts because you chose some predators and their prey to populate your aquarium with.

Project for the course 'Multimedia Datenbanken (Aufbaukurs) - Sommersemester 2025' at HTWK Leipzig.

Contributors: Alexander Reiprich, Chiara Schepke

## Prerequisites

- MySQL
- Node.js / npm

## Instructions for local usage

1. Clone repository
2. Install dependencies for both client and server with `npm install` in the respective directories
3. On mac: Navigate to server/db/ and run `mysql -u root -p < setup.sql`
   on windows: use mysql workbench to execute the script
4. Make sure the created database is running
   by logging into mysql `mysql -u root -p`
   and entering SHOW PROCESSLIST you can check if fishbase exists
5. add database details to /server/.env file as follows:

   MYSQLHOST=localhost # or any other IP you want the database to be running on
   MYSQLPORT=<port> # the port you want the database to be running on - 3000 is taken by the server
   MYSQLUSER=<user> # the user you chose on mysql install
   MYSQLPASSWORD=<password> # the password you chose on mysql install, comment this line out if there is no password
   MYSQLDATABASE=fishbase
   JWT_SECRET=<jwt>; (at this time you can use the default token from jwt.io)

6. Execute 'addImgs' script in server/package.json `npm run addImgs` to add images
7. Run `npm run start` in both the client and server directories
8. The app is now available on http://localhost:3000/
