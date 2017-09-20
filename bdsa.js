var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var MemcachedStore = require('connect-memcached')(session);
var uuid = require('node-uuid');
var Schema = mongoose.Schema;
var async = require("async");
const fileUpload = require('express-fileupload');

var fs = require('fs');

const nodemailer = require('nodemailer');
const mailConfig = require('./mailConfig');
const mailContent = require('./mailContent');
const User = require('./models/user');
const Webinar = require('./models/webinar');
const Email = require('./models/emailcontent');

var milliseconds = new Date().getTime();
let humanDate = new Date(milliseconds);

console.log(humanDate.getFullYear());

console.log(milliseconds);

let transporter = nodemailer.createTransport({
    host: mailConfig.sender.host,
    port: mailConfig.sender.port,
    secure: true, // use TLS
    auth: {
        user: mailConfig.sender.authUser,
        pass: mailConfig.sender.authPass
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

mongoose.connect('mongodb://localhost/webinar');
global.db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var navigation = require('./routes/navigation')


// Init App
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io').listen(serv);

// Declare the Express session
var sessionMiddleware = session({
    secret: 'the most secretive secret possible',
    saveUninitialized: true,
    resave: true,
    store: new MemcachedStore({
        hosts: ['127.0.0.1:11211'],
    })
});

// Express session middleware for Socket.io
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Initialise the Express Session
app.use(sessionMiddleware);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'default'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.inCart = 11;
  if (res.locals.user) {
    for (var i in res.locals.user) {
      if (i === 'username') {
        req.session.username = res.locals.user[i];
      }
    }
  }
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/', navigation);

// Set Port
app.set('port', (process.env.PORT || 4010));

// Start the Server
serv.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

USERS_ONLINE = {};

/*
let mailOptions = {
	from: '"ORDER PLACED" <autoemail@esrhost.com>',
	to: mailConfig.recipient,
        subject: mailConfig.subject,
        text: mailContent,
};

transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
               return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
});


var newWebinar = new Webinar({
  host: "Stanislav Yordanov",
  video: "https://www.youtube.com/embed/G7b-_YcACuQ",
  dates: [{
    date: "12.09.2017",
    hour: "15:43",
  }],
  addInfo: [{
    header: "Lala some header",
    content: "Lala some content",
  }]
})

newWebinar.save();

var newEmail = new Email({
  subject: "This is a default subject",
  content: "This is default content",
})

newEmail.save();
*/


io.sockets.on('connection', function(socket) {

    username = socket.request.session.username;
    sessionid = socket.request.sessionID;

    USERS_ONLINE[username] = socket.id;

    socket.on('getAllUsers', function () {
async.waterfall([
	function(callback){
		User.getAllUsers(function (err, users){
			if (err) throw err;
			callback(null, users);
		});
	},
	function(arg1, callback){
		console.log(arg1);
		socket.emit('sendAllUsers', arg1);
	}
]);
    });

  socket.on('bulletinChange', function(data) {
      if (data.webinar === 1) {
          Email.findById("59b16afc9e4b05c12a49f512", function(err, doc) {
            if (err) console.log(error);
            doc.content = data.bulletinContent;
            doc.subject = data.bulletinSubject;
            doc.save();
          });
      } else {
          Email.findById("59b16bbb9eeca7192da347f1", function(err, doc) {
            if (err) console.log(error);
            doc.content = data.bulletinContent;
            doc.subject = data.bulletinSubject;
            doc.save();
          });
      }

  });

    socket.on('addWebinarInfo', function(data) {

      console.log(data.webinarName + " DIASJDSAIJ");

        if (data.webinarNum === 1) {
             Webinar.findById("59b1495222770efa502f2935", function(err, doc) {
                doc.active = data.active;
                doc.name= data.webinarName;
                doc.host = data.host;
                doc.video = data.video;
                doc.dates = data.dates;
                doc.addinfo = data.addinfo;
                doc.save(function(err) {
                  if (err) throw err;
                  console.log(doc);
                })
              });
        } else {
             Webinar.findById("59bcbac0f89a89244f21d173", function(err, doc) {
                doc.active = data.active;
                doc.host = data.host;
                doc.name= data.webinarName;
                doc.video = data.video;
                doc.dates = data.dates;
                doc.addinfo = data.addinfo;
                doc.save(function(err) {
                  if (err) throw err;
                  console.log(doc);
                })
              });
        }

    });

    socket.on("getWebinarInfo", function(data) {
        if (data === 1) {
            Webinar.findById("59b1495222770efa502f2935", function(err, doc) {
              if (err) console.log(error);
              socket.emit("receiveWebinarInfo", doc);
            });
        } else {
            Webinar.findById("59bcbac0f89a89244f21d173", function(err, doc) {
              if (err) console.log(error);
              socket.emit("receiveWebinarInfo", doc);
            });

        }
    });

    socket.on("getWebinarNames", function(data) {
        webinarNames = [];
        async.waterfall([
            function(callback) {
                Webinar.findById("59b1495222770efa502f2935", function(err, doc) {
                  if (err) console.log(error);
                  item = {
                      name: doc.name,
                      active: doc.active,
                  }
                  webinarNames.push(item);
                  callback();
                });
            },
            function(callback) {
                Webinar.findById("59bcbac0f89a89244f21d173", function(err, doc) {
                  if (err) console.log(error);
                  item = {
                      name: doc.name,
                      active: doc.active,
                  }
                  webinarNames.push(item);
                  callback();
                });
            },
            function(callback) {
                console.log(webinarNames);
                socket.emit("sendWebinarNames", webinarNames);
            }
        ]);
    })

    socket.on('disconnect', function() {
        delete USERS_ONLINE[socket.id];
        delete chatId;
    });

});
