const PORT = 3000;
const express = require('express');
const app = new express();

// For MongoDB and mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/galleryDB',
{
    useNewURLParser:true,
    useUnifiedTopology:true
});


// For file-uploads
const fileUpload = require('express-fileUpload');

// For Posts

const Post = require("./database/model/Post");
const path = require('path');

// For processing inputs and values in the database
app.use (express.json());
app.use(express.urlencoded({extended: true}));

// File uploading and placing our resources within our localhost directory
app.use(express.static('public'));
app.use(fileUpload());

// Using handlebars
var hbs = require('hbs');
app.set('view engine','hbs');

// ROUTES
app.get('/content', async(req,res) => {
    const posts = await Post.find({});
    console.log(posts);
    res.render('content',{posts});
});

app.post('/submit-post', function(req,res) {
    const {image} = req.files;
    image.mv(path.resolve(__dirname,'public/images',image.name),(error) => {
        Post.create({
            ...req.body,
            image:'/images/'+image.name
        }, (error,post) => {
            res.redirect('/');
        });
    });
});

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/' + 'index.html');
});

var server = app.listen(PORT, function() {
    console.log ("Node server is running at port "+PORT+"...");
});