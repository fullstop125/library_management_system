// Express Setup
const express = require('express');
const app = express();

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
// app.use(app.router);
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: false
}))
app.use(bodyParser.json());


// GET REQUESTS
app.get('/login', function (req, res) {
    res.render('login.pug')
})
app.get('/register', function (req, res) {
    res.render('register.pug')
})
app.get('/create', (req, res) => {
    res.render('create.pug')
})
// app.get('/404', (req, res) => {
//     res.render('404.pug')
// })

var main = async () => {
    // const uri = "mongodb+srv://eva:studentmanagementsys@studentmanagementsys.motku.mongodb.net/<dbname>?retryWrites=true&w=majority";
    const uri = "mongodb+srv://eva:libmanagement@libmanagement.lhiav.mongodb.net/libmanagement?retryWrites=true&w=majority";

    const client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 300000,
        keepAlive: 1
    });

    app.get('/', (req, res) => {
        if (client.isConnected()) {
            console.log('connected')
            res.render('welcome.pug')
        } else {
            res.render('500.pug')
        }
    })

    await client.connect(function (err) {
        if (err) console.error(err);

        console.log('MongoDB connected');

        // Connect to collections
        const libCollection = client.db("libmanagement").collection("libStudentInfo");

        // perform actions on the collection object
        // POST REQUESTS
        app.post('/create', (req, res) => {
            console.log(req.body)
            res.send("Quote submitted")
            libCollection.insertOne(req.body)
                .then(function (result) {
                    console.log(result)
                })
                .catch(error => console.error(error))
        })

        // GET REQUESTS
        app.get('/read', function (req, res) {
            libCollection.find().toArray()
                .then(function (result) {
                    console.log(result)
                    res.render('index.pug', {
                        data: result
                    })
                })
                .catch(function (err) {
                    console.log('Error caused by ./info get request:', err)
                })
        })

        // UPDATE REQUESTS
        app.put('/update', (req, res) => {
            console.log(req.body)

            libCollection.findOneAndUpdate({
                    name: req.body.name1
                }, {
                    $set: {
                        name: req.body.name2
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
        app.delete('/delete', (req, res) => {
            console.log(req.body)

            libCollection.deleteMany({
                    name: req.body.name
                })
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })
        
        // Handle 404 Page
        app.use(function(req, res, next) {
            res.status(404).render('404.pug');
            next();
        });

        // client.close()
    });

}

main().catch(err => console.log(`Error caught when triggering main() err: ${err}`))


app.listen(5000, function () {
    console.log('Listen to port 5000')
})