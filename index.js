// MomentJs
var moment = require('moment'); 

// Express Setup
const express = require('express');
const app = express();Ñ
const path = require('path');

// MongoDB Setup
const MongoClient = require('mongodb').MongoClient;

// Moongose Setup
const mongoose = require('mongoose');
const Student = require('./models/student')

// Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));


// VIEW ENGINE
app.set('view engine', 'pug');
app.use(express.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))


// CONNECT TO DB
// make a connection
const uri = "mongodb+srv://eva:libmanagement@libmanagement.lhiav.mongodb.net/libmanagement?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 300000,
    keepAlive: 1,
    useFindAndModify: false
});


// get reference to database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection to db error:'));

db.once('open', function() {
    console.log("Connection Successful!");
})
.then(()=>{

    // GET REQUESTS
    app.get('/', (req, res) => {
        Student.find({}, function(err, data) {
            if (err) console.log('Caused at the root (/) file: ', err);
            
            // Registered Users
            var registeredUsers = data.length;
            
            // Active Users
            var haveBooks = [];
            var activeUsers = 0;
            
            // console.log(data);
            data.forEach(element => {
                if (element.books.length > 0) {
                    haveBooks.push(element.books.length);
                }
                // console.log(haveBooks);
            });
            activeUsers = haveBooks.length

            // Borrowed Books
            var borrowedBooks = 0
            haveBooks.forEach(books => {
                borrowedBooks += books
            });

            // Overdue Books
            var overdue = 0;
            data.map(eachStudent => {
                eachStudent.books.forEach(element => {
                    let diffInDays = moment(element.returndate).diff(moment(), 'days')
                    if (diffInDays < 0) {
                        overdue++
                    }
                });
            })
            // console.log(reminderInfo[0].books);

            res.render('welcome.pug', {
                data: data,
                registeredUsers: registeredUsers,
                activeUsers: activeUsers,
                borrowedBooks: borrowedBooks,
                overdue: overdue,
            })
        })
    
    })
    app.get('/reminders', function (req, res) {
        Student.find({}, function(err, data) {
            // Reminder Timeline
            var reminderInfo1 = data.filter((person)=>{
                if (person.books.length >= 1) {
                    return person;
                }
            })
            reminderInfo1.forEach((elem)=>{
                elem.books = elem.books.filter((element)=>{
                    if (moment(element.returndate).diff(moment(), 'days') < 7 && moment(element.returndate).diff(moment(), 'days') > 0) {
                        return element;
                    }
                })
            })
            const reminderInfo = reminderInfo1.filter((person)=>{
                if (person.books.length >= 1) {
                    return person;
                }
            })
    
            res.render('reminders.pug', {
                reminderInfo: reminderInfo
            })
        })
    })
    app.get('/overdue', function (req, res) {
        Student.find({}, function(err, data) {
            // Overdue Timeline
            var overdueInfo1 = data.filter((elem)=>{
                if (elem.books.length >= 1) {
                    return elem;
                }
            })
            overdueInfo1.forEach((elem)=>{
                elem.books = elem.books.filter((element)=>{
                    if (moment(element.returndate).diff(moment(), 'days') < 0) {
                        return element;
                    }
                })
            })
            const overdueInfo = overdueInfo1.filter((user)=>{
                if (user.books.length >= 1) {
                    return user;
                }
            })
            
            res.render('overdue.pug', {
                overdueInfo: overdueInfo
            })
        })
    })

    app.get('/error', function (req, res) {
        res.render('error.pug')
    })
    app.get('/success', function (req, res) {
        res.render('success.pug')
    })

    app.get('/book', function (req, res) {
        res.render('book.pug')
    })
    app.get('/users/:id/', function (req, res) {
        Student.findById(req.params.id, function(err, data) {
            res.render('info.pug', {
                data: data
            })
        })
    })
    // app.get('/books:id/', function (req, res) {
    //     res.send('Here')
    //     // console.log(req.params.id);
    //     // res.render('info.pug')
    //     // Student.findById(req.params.id, function(err, data) {
    //     //     // console.log(data)
    //     //     res.render('info.pug', {
    //     //         data: data
    //     //     })
    //     // })
    // })

    app.get('/users', (req, res) => {
        Student.find({}, function(err, data) {
            // console.log(data)
            res.render('users.pug', {
                data: data
            })
        })
    })
    app.get('/create', (req, res) => {
        res.render('create.pug')
    })
    app.get('/update', (req, res) => {
        Student.find({}, function(err, data) {
            res.render('update.pug', {
                data: data
            })
        })
    })
    app.get('/delete', (req, res) => {
        Student.find({}, function(err, data) {
            // Active Users
            var haveBooks = [];
            var activeUsers = 0;
            
            // console.log(data);
            data.forEach(element => {
                if (element.books.length > 0) {
                    haveBooks.push(element.books.length);
                }
                // console.log(haveBooks);
            });
            activeUsers = haveBooks.length

            // Borrowed Books
            var borrowedBooks = 0
            haveBooks.forEach(books => {
                borrowedBooks += books
            });


            // console.log(data)
            res.render('delete.pug', {
                data: data,
                activeUsers: activeUsers,
                borrowedBooks: borrowedBooks,
            })
        })
    })


    // POST REQUESTS
    app.post('/create', (req, res) => {
        var newStudent = new Student({
            name: req.body.name,
            studentid: req.body.studentid,
            phoneno: req.body.phoneno,
            libcardno: req.body.libid,
            feestats: req.body.feestats == 'Paid' ? true : false
        })
        newStudent.save(function (err) {
            if (err) {
                res.render('error.pug')
                return handleError(err)
            };
            // saved!
            res.render('success.pug')
        });
    })


    // UPDATE REQUESTS
    app.put('/update', (req, res) => {
        // console.log(req.body)

        Student.findByIdAndUpdate(req.body.id, {
                $push: {
                    books: {
                        title: req.body.books[0].title,
                        bookid: req.body.books[0].bookid,
                        dateborrowed: req.body.books[0].dateborrowed,
                        returndate: moment().add(7, 'd').format(),
                        bookstats: req.body.books[0].bookstats,
                    }
                }
            }, {
                upsert: true
            })
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
    })
    app.put('/updatestudent', (req, res) => {
        console.log(req.body.id)
        Student.findByIdAndUpdate(req.body.id, {
            $set: {
                name: req.body.name,
                studentid: req.body.studentid,
                libcardno: req.body.libcardno,
                phoneno:req.body.phoneno,
                feestats: req.body.feestats == 'Paid' ? true : false
            }
        }, {
            upsert: true
        })
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
    })

    // DELETE REQUESTS
    app.delete('/deletebooks', (req, res) => {
        
        Student.updateMany({_id: req.body.id}, { $set: { books: [] } }, (err)=>{
            if(err) console.log('DeleteError:: ', err);
            // console.log('Done')
        })
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
        return;
    });
    
    app.delete('/deleteone', (req, res) => {
        
        req.body.ids.forEach(id => {
            // console.log(id)
            Student.findByIdAndRemove(id, (err)=>{
                if(err) console.log('DeleteError:: ', err);
                // console.log('Done')
            })
            .then(() => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })
        return;
    });
    
    app.delete('/deleteall', (req, res) => {
        Student.deleteMany({}, (err)=>{
            if(err) console.log('DeleteError:: ', err);
        })
        .then(result => {
            res.json('Success')
        })
        .catch(error => console.error(error))
        return;
    });
    
    // Handle 404 Page
    app.use(function(req, res, next) {
        res.status(404).render('404.pug');
        next();
    });

    // client.close()
})
.catch(err => console.log(`Error caught when triggering main() err: ${err}`));


app.listen(5000, function () {
    console.log('Listen to port 5000')
});
    