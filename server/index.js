const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // For file uploads (if needed)
const path = require('path');
const session = require('express-session'); // For session management
const cookieParser = require('cookie-parser'); // To work with cookies
const jwt = require('jsonwebtoken'); // For authentication (if needed)
const bcrypt = require('bcrypt'); // For password hashing (if needed)


// here we declare all models
const UserModel = require("./models/Rejister")
const app = express();

app.use(cors({
  origin: [ 'http://localhost:3001', 'http://localhost:5173'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/prj3");

app.post("/register", (req, res) => {
    const {  username, email, password, role } = req.body;
    
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("already have an account");
            } else {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        UserModel.create({
                            username: username,
                            email: email,
                            password: hash, 
                            role: role
                        })
                        .then(result => res.json("Account created successfully"))
                        .catch(err => res.json(err));
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
});

// here we check our deta through get 
app.get("/get_register", (req, res) => {
    UserModel.find({})
        .then(function(users) {
            res.json(users);
        })
        .catch(function(err) {
            res.json(err);
        });
});


// login portal 
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign(
                            { email: user.email, username: user.username },
                            "jwt-secret-key",
                            { expiresIn: "1d" }
                        );
                        res.cookie('token', token);
                        return res.json({ status: "success" });
                    } else {
                        return res.json("password is incorrect");
                    }
                });
            } else {
                res.json("this email id is not registered");
            }
        })
        .catch(err => res.json(err));
});



// get login
app.get("/get_login", (req, res) => {
    UserModel.find({})
        .then(function(users) {
            res.json(users);
        })
        .catch(function(err) {
            res.json(err);
        });
});



// Middleware to verify user before accessing protected routes
const verifyuser = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.json("The token is missing");
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json("The token is invalid"); // Token verification failed
            } else {
                req.email = decoded.email;
                req.username = decoded.username;
                next();
            }
        });
    }
};



app.get('/', verifyuser, (req, res) => {
    return res.json({ email: req.email, username: req.username });
});

const PORT = 3001; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
