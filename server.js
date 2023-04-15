//temporay and quick solution for the quick view of the UI or mock up site

//Cannot use this server in publusing 

//A Js with Express way of impementing server like PHP or SQL just like we did in Semester 3
const express = require('express');

const server = express();

const port = process.env. PORT || 5050;

//configure the back end to acceppt incoming data
//either as JSON payload or as a form data (encoded url strings)

server.use(express.json());
server.use(express.urlencoded({ extended: false })); //url?key=value&&key=value

//this route manages users data
server.use('/ums', require('./routes/api'));

server.listen(port, () => {
  console.log(`server is running on ${port}`);
}
)
