var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model')
var db = 'mongodb://localhost/example';
var port = 8080;
mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('happy to be here');
});

app.get('/books', function (req, res) {
    console.log('getting all books...');
    Book.find({})
        .exec(function (err, books) {
            if (err) {
                res.send('an error occured');
            } else {
                console.log(books);
                res.json(books);
            }
        });
});

app.get('/books/:id', function (req, res) {
    console.log('getting one book...');
    Book.findOne({
        _id: req.params.id
    }).exec(function (err, book) {
        if (err) {
            console.log('an error ocurred');
            res.send('error ocurred');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.post('/books', function(req, res){
    var newBook = new Book();
    
    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;
    
    newBook.save(function(err, book){
        if (err) {
            res.send('an error ocurred, book could not be saved');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.post('/books2', function(req, res){
    Book.create(req.body, function(err, book){
        if (err) {
            res.send('an error occured');
            console.log('an error occured');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.put('/books/:id', function(req,res){
    Book.findOneAndUpdate({
        _id: req.params.id
    }, {$set: {
        title: req.body.title
    }},{upsert: true}, function(err, book){
     if (err){
         res.send('error occured');
     }   else {
         res.send(book);
     }
    })
});

app.delete('/books/:id', function(req, res){
    Book.findOneAndRemove({
        _id: req.params.id
    }, function (err, book){
        if (err){
            res.send('error occured');
        } else {
            res.send(book);
        } 
    });
});


app.listen(port, function () {
    console.log('App running on port: ' + port);

});
