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

var upload2 =  multer({
  dest: './uploads',
  rename: function(fieldname, filename) {
      return filename;
  },
  onFileUploadStart: function(file) {
      console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function(file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
})

//Connect to MongoDB
mongoose
  .connect(
    'mongodb://localhost:27017/kam',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Image');

app.post('/post_img', upload2.any('photo'),function(req, res) {
  console.log(req.files);
  res.send("File uploaded.");
});

app.listen(port, function () {
  console.log('Example app listening on port '+ port +'!');
});
