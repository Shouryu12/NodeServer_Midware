#!/usr/bin/env nodejs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const request = require('request');
const fs = require('fs');
const port = 3000;

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

app.get('/', (req, res) => {
  Item.find({}, (err,images) => {
    if(err){
      console.log(err);
    }else{
      console.log("Carregando")
      res.render("index", {
        images: images
      })
    }
  }).catch(err => res.status(404).json({ msg: 'No items found' }));
});


app.post('/image/add', upload.single('picture'), (req, res) => { 
  console.log(req.body)
  console.log("Postando")

  const newImage = new Image({
      imageName: req.body.imageName,
      imageData: __dirname + '/' + req.file.path
    })

    console.log("Quase")
    
    newImage.save().then((result) => {
      request.post(url:'http://127.0.0.1:3001/upload',req)
    });
});

app.listen(port, function () {
  console.log('Example app listening on port '+ port +'!');
});
