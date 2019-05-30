#!/usr/bin/env nodejs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const port = 3001;

const app = express();

app.get('/hey', function(req, res){
  console.log('Entrou!')
  res.send(200, "HEY I'M INSIDE A COMPOSE");
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ' - ' + Date.now())
  }
})

var upload = multer({ storage: storage })

//Connect to MongoDB
mongoose
  .connect(
    'mongodb://localhost:27017/kam',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Image');


app.post('/upload', upload.single('photo'))
app.listen(port, function () {
  console.log('Example app listening on port '+ port +'!');
});
