
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const md5 = require('md5')


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require('mongoose');
const { response } = require('express');
mongoose.connect('mongodb://localhost:27017/AuthanticationDB',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
const User = mongoose.model('User', userSchema)



app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/secrets', (req, res) => {
    res.render('secrets')
})


app.post('/register', (req, res) => {
    const NewUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    NewUser.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/secrets')
        }
    })
})
app.post('/login', (req, res) => {
    const user = req.body.username;
    const password = md5(req.body.password);
    User.findOne({ email: user }, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                console.log("credential found")
                if (foundUser.password === password) {
                    res.redirect('/secrets')
                } else {
                    console.log("wrong password")
                }
            } else {
                console.log('credential does not exist')
            }
        }
    })

})



app.listen(3000, () => {
    console.log('server is running on 3000')
})