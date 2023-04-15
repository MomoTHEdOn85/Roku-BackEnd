const express = require('express');

const router = express.Router();

//import thr mySql pachake
const sql = require('mysql');
const creds = require('../config/user');

//makes conncection to sql database on our machines
//or
//creates a pool of potential connections and use the 
//sql user credentials to connect to your instance of mySql
//on our machine
const pool  = sql.createPool(creds);


router.get('/', (req, res) => {
  res.json({message: 'hit ums API root'});
  
})

//try to authentocate a user through the login route
router.post("/login", (req, res) => {
  console.log('hit the login route');
  console.log('user data:', req.body);

  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query(`SELECT username, password FROM users WHERE username="${req.body.username}"`, function (error, results) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      let result = { message: '' }
      

      //what if that user doesnt exist? no username 
      if(results.length == 0) {
      //no matching username..maybe provide a sign up form / button
        result.message = 'no user'; 
      }else if (results[0].password !== req.body.password) {
        //no matching password.mark the password feild onthe client side
        result.message = 'wrong password' 
      } else {
        result.message = 'success',

        delete results[0].password; //get rid of the pass bsz its a sensitive info that shouldn't be public
        result.user = results[0]; //pass the user datat back to the Roku app
      }

       
       
 

   
      // Don't use the connection here, it has been returned to the pool.
      res.json(result);
    });
  });
 
})

router.get('/users', (req, res) => {
  console.log(req.params.user);
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query(`SELECT * FROM users`, function (error, results) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      //Sanitize our data a bit - get rid of stuff that shouldn't be public
      results.forEach(user =>{
        delete user.password;
        delete user.fname;
        delete user.lname;

        //if there is no avatar, then add this pic
        if(!user.avatar) {
          user.avatar = "temp_avatar.jpg";
        }
      })


       

      console.log(results);
   
      // Don't use the connection here, it has been returned to the pool.
      res.json(results);
    });
  });
})



//retrieves all users from a database
router.get('/users/:user', (req, res) => {
  console.log(req.params.user);
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query(`SELECT * FROM users WHERE id=${req.params.user}`, function (error, results) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      //remove my sensitive info from the database(s)
      delete results[0].passwords;
      delete results[0].fname;
      delete results[0].lname;

      // add a temp avatar here if there isn't one
      if(results[0].avatar === null) {
        results[0].avatar = "temp_avatar.jpg"
      }

      console.log(results);
   
      // Don't use the connection here, it has been returned to the pool.
      res.json(results);
    });
  });
})


//retreives one user from a database based on that user's ID or naother field
 

module.exports = router;