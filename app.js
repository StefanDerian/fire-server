var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//mqtt example

var mqtt = require('mqtt');
//test
var options = {
  username:"98072d26b785",
  password:'UNIHACK_Bosch85',
  keepalive: 5
};
var client  = mqtt.connect('tcp://bosch.unihack.net/mqtt',options);
var firebase = require ('firebase');
var config = {
  apiKey: "AIzaSyCNdOKbwCnyNp5NnTTf4CMUyNHRERp3B0I",
  authDomain: "firebendr-b062d.firebaseapp.com",
  databaseURL: "https://firebendr-b062d.firebaseio.com/"
};

firebase.initializeApp(config);

console.log(firebase.app().name);

client.on('connect', function () {
  console.log("connected")
  client.subscribe('telemetry/98072d26b785/humidity')
  client.publish('telemetry/98072d26b785/humidity')
});

client.on('message', function (topic, message) {
  // message is Buffer
  var message_str = message; //convert byte array to string
	// message_str = message_str.replace(/\n$/, ''); //remove new line
	// message_str = message_str.replace(/\$/, ''); //remove new line
  if (message_str != ""){
    console.log(JSON.parse(message_str.toString()));

    // continue here to post it to the database
    var fireListRef = firebase.database().ref('FireData');
    var newFireRef = fireListRef.push();

    newFireRef.set(JSON.parse(message_str.toString()));
    // We've appended a new message to the message_list location.
    // var path = newMessageRef.toString();
    console.log(newFireRef);
    // // path will be something like
    // // 'https://sample-app.firebaseio.com/message_list/-IKo28nwJLH0Nc5XeFmj'
  }





})






module.exports = app;
