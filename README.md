# Martian robots simulation

Code that simulates robot instructions into a grid and returns its destination. The technologies that were used are NodeJS and MongoDB.

Live demo at: http://martian-robots.tomastm.me/

### How it works?

This project also renders ejs content in order to make the interaction easier and present the results graphically. At the index page, you can provide instructions and start a simulation or, if you prefer, select a saved simulation from the list.

## How to install and run?

Install and change directory

`git clone https://github.com/tomas249/martian-robots.git`

`cd martian-robots`

### with NPM

Change mongodb path to `mongodb://localhost:27017/martian-robots` into /config/config.env file.

Install dependencies
`npm install`

Run
`npm start` to start with node or `npm run dev` to start with nodemon.

Access at: http://localhost:3000/

### with Docker

At root directory, execute:
`docker-compose up`

Access at: http://localhost:9000/
