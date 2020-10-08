var express = require('express')
var app = express()
var mysql = require('mysql')
var config = require('../config')

var dbConnection;
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
            setTimeout(handleDisconnect, 2000);
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

// Save conference deatils
app.post('/addConference', function(req, res, next) {
    conference = {
        'name': req.body.conference.name,
        'location': req.body.conference.place,
        'date': req.body.conference.date,
        'description': req.body.conference.description,
        'image': req.body.conference.logo,
        'ownerEmail': req.body.conference.ownerEmail
    };

    dbConnection.query('INSERT INTO tblconference SET ?', conference, function(err, result) {
        //if(err) throw err
        if (err) {
            res.send(JSON.stringify(err));
            console.log(err);
        } else {				
            //res.send(JSON.stringify(result));
            console.log("success conference added successfully");
        }
    });
});

// Save lectures deatils
app.post('/addLectures', function(req, res, next) {
    var lectures = req.body.lecture;
    var conferenceName = req.body.conferenceName;
    var authors;
    var lecture;
    var authorsgroup;

    for(var i = 0; i< lectures.length; i++) {
        authors = createAuthors(lectures[i].authors, lectures[i].lectureName);
        //authorsgroup = createAuthorsGroup(authors, lectures[i].lectureName);

        lecture = {
            'name': lectures[i].lectureName,
            'start_time': lectures[i].lectureStartTime,
            'end_time': lectures[i].lectureEndTime,
            'description': lectures[i].lectureDescription,
            'room': lectures[i].lectureClass,
            'file': lectures[i].lectureFile,
            'conferenceName': conferenceName,
            'authorGroupName': lectures[i].lectureName,
            'sessionName': lectures[i].lectureSession
        };

        dbConnection.query('INSERT INTO tbllecture SET ?', lecture, function(err, result) {
            //if(err) throw err
            if (err) {
                res.send(JSON.stringify(err));
                console.log(err);
            } else {				
                //res.send(JSON.stringify(result));
                console.log("success lectures added successfully");
            }
        });

       /* dbConnection.query('INSERT INTO tblauthorgroup SET ?', authorsgroup, function(err, result) {
            //if(err) throw err
            if (err) {
                res.send(JSON.stringify(err));
                console.log(err);
            } else {				
                //res.send(JSON.stringify(result));
                console.log("success authorgroup added successfully");
            }
        });*/
    }

});

// Save sessions deatils
app.post('/addsessions', function(req, res, next) {
    sessions = req.body.session;
    var conferenceName = req.body.conferenceName;

    for(var i = 0; i< sessions.length; i++) {
        session = {
            'name': sessions[i].sessionName,
            'category': sessions[i].sessionCategory,
            'location': sessions[i].sessionLocation,
            'lead': sessions[i].sessionLead,
            'conferenceName': conferenceName,
            'authorGroupName': lectures[i].lectureName,
        };

        
        dbConnection.query('INSERT INTO tblsession SET ?', session, function(err, result) {
            //if(err) throw err
            if (err) {
                res.send(JSON.stringify(err));
                console.log(err);
            } else {				
                //res.send(JSON.stringify(result));
                console.log("success session added successfully");
            }
        });
    }
});

// Save breaks deatils
app.post('/addbreaks', function(req, res, next) {
    breaks = req.body.break;
    var conferenceName = req.body.conferenceName;

    for(var i = 0; i< breaks.length; i++) {
        oneBreak = {
            'name': breaks[i].breakName,
            'start_time': breaks[i].breakStartTime,
            'end_time': breaks[i].breakEndTime,
            'description': breaks[i].breakName,
            'room': 'outside',
            'conferenceName': conferenceName
        };

        
        dbConnection.query('INSERT INTO tbllecture SET ?', oneBreak, function(err, result) {
            //if(err) throw err
            if (err) {
                res.send(JSON.stringify(err));
                console.log(err);
            } else {				
                //res.send(JSON.stringify(result));
                console.log("success break added successfully");
            }
        });
    }
});

function createAuthors(reqAuthors, lectureName) {
    var authors;
    for(var i = 0; i < reqAuthors.length; i++) {
        authors = {
            'name': reqAuthors[i].lecturerName,
            'company': reqAuthors[i].lecturerCompany,
            'role': reqAuthors[i].lecturerRole,
            'cv': reqAuthors[i].lecturerCV,
            'isLecturer': reqAuthors[i].isLecturer,
            'authorImage': reqAuthors[i].authorImage,
            'lectureName': lectureName
        };

        dbConnection.query('INSERT INTO tblauthors SET ?', authors, function(err, result) {
            //if(err) throw err
            if (err) {
                res.send(JSON.stringify(err));
                console.log(err);
            } else {				
                //res.send(JSON.stringify(result));
                console.log("success authors added successfully");
            }
        });
    }
    return authors;
}

function createAuthorsGroup(authors, groupName) {
    var group;
    for(var i = 0; i < authors.length; i++) {
        group = {
            'authorName': authors[i].name,
            'groupName': groupName
        };
    }
    console.log('HERE');
    console.log(group);
    return group;
}

module.exports = app