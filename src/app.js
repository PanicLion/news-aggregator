const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('express').Router();
const morgan = require('morgan');
const winston = require('winston');
const news = require('./routes/news');
const preferences = require('./routes/preference');
const { signup, signin } = require('./controller/authController');

const { format } = winston;
const logger = winston.createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((msg) => {
            return `${msg.timestamp} [${msg.level}] ${msg.message}`;
        })
    ),
    transports: [
        // new winston.transports.File({ filename: 'combined.log', level: 'http' }) // to write the logs into a file we have to remove colorize()
        new winston.transports.Console({ level: 'http'})
    ],
});


const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
    }
);


const app = express();
app.use(cors());
app.use(morganMiddleware);
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const PORT = 3000;

routes.get('/', (req, res) => {
    res.status(200).send("Welcome to News Aggregator.");
});

routes.use('/news', news);
routes.use('/preferences', preferences);

routes.post('/register', signup);

routes.post('/login', signin);

app.listen(process.env.PORT || PORT, (error) => {
    if (!error){
        console.log("Server is Successfully running and app is listening to port " + PORT);
    } else{
        console.log("Error occurred, server can't start", error);
    }
});
