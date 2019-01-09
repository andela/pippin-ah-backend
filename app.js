import  fs  from  'fs';
import  http from  'http';
import path  from 'path';
import methods from 'methods';
import express from 'express';
import bodyParser from 'body-parser';
import session  from 'express-session';
import cors  from 'cors';
import passport from 'passport';
import errorhandler from 'errorhandler';
import dotenv from 'dotenv';
import routes from './routes/index';
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

app.use(
    session({
        secret: "authorshaven",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);


require("./models/User");

app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to Authors Haven!',
  }));
app.use('/api/v1', routes);

app.get('*', (req, res) => res.status(400).send({ message: 'Welcome To the Den of Authors' }));


// finally, let's start our server...
app.listen(process.env.PORT || 3000, () => {
  console.log('Server runing on some port');
});
