var express = require('express')
var app = express()

var mysql = require('mysql')
var config = require('../config')

var dbConnection
function handleDisconnect() {

  dbConnection = mysql.createConnection({
      host:	  config.database.host,
      user: 	  config.database.user,
      password: config.database.password,
      port: 	  config.database.port, 
      database: config.database.db
  });
  dbConnection.connect(function(error) {
      if(!!error) {
          console.log('Error connection to mySql');
          console.log(error);
      } else {
          console.log('connect successfully to mySql');
      }
  });
  
  dbConnection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
  });
}

handleDisconnect();

app.get('/', function(req, res, next) {
    console.log("hellow world");    
});

// get conferences
app.post('/conference', function(req, res, next) {
    var sqlString = 'SELECT * FROM  tblconference WHERE ownerEmail="'+req.body.email+'"';

    dbConnection.query(sqlString, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("get conferences successfully");				
          res.send(JSON.stringify(result));
        }
    });
});

// get lectures
app.post('/lectures', function(req, res, next) {
    var sqlString = 'SELECT tbllecture.*, tblauthors.name AS author FROM  tbllecture, tblauthors WHERE tbllecture.conferenceName="'
    +req.body.conferenceName+'" AND tbllecture.name=tblauthors.lectureName AND tblauthors.isLecturer="1"';

    dbConnection.query(sqlString, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("get lectures successfully");				
          res.send(JSON.stringify(result));
        }
    });
});

// get sessions
app.post('/sessions', function(req, res, next) {
    var sqlString = 'SELECT * FROM  tblsession WHERE conferenceName="'
    +req.body.conferenceName+'"';

    dbConnection.query(sqlString, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("get lectures successfully");				
          res.send(JSON.stringify(result));
        }
    });
});

// delete lecture
app.post('/deleteLecture', function(req, res, next) {
    var sqlString = 'DELETE FROM  tbllecture WHERE name="'
    +req.body.lectureName+'"';

    dbConnection.query(sqlString, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("lecture deleted successfully");				
          //res.send(JSON.stringify(result));
        }
    });

    authorDeleteQuery = 'DELETE FROM  tblauthors WHERE lectureName="'
    +req.body.lectureName+'"';
    dbConnection.query(authorDeleteQuery, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("author deleted successfully");				
          //res.send(JSON.stringify(result));
        }
    });
});

// delete session
app.post('/deleteSession', function(req, res, next) {
    var sqlString = 'DELETE FROM  tblsession WHERE name="'
    +req.body.sessionName+'"';

    dbConnection.query(sqlString, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("lecture deleted successfully");				
          //res.send(JSON.stringify(result));
        }
    });
});

// update publish
app.post('/updatePublish', function(req, res, next) {
    var sqlString = 'UPDATE tblconference  SET publish=1 WHERE name="'
    +req.body.conferenceName+'"';

    dbConnection.query(sqlString, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {
          console.log("lecture deleted successfully");				
          //res.send(JSON.stringify(result));
        }
    });
});

module.exports = app