import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

import Issue from './models/issue';

const app = express();

const router = express.Router();
app.use(cors());
app.use(bodyParser.json());

const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const filename = path.join(logDir, 'results.log');

var logger = new createLogger({
  level: 'silly',
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console(), new transports.File({ filename })]
});

logger.error('Connecting DB');
logger.warn('Connecting DB');
logger.info('Connecting DB');
logger.verbose('Connecting DB');
logger.debug('Debugging connecting DB');
mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open', () => {
  logger.silly('MongoDB database connection established successfully!');
});

router.route('/issues').get((req, res) => {
  Issue.find((err, issues) => {
    if (err) {
      console.log(err);
    } else {
      res.json(issues);
    }
  });
});

router.route('/issues/:id').get((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (err) {
      console.log(err);
    } else {
      res.json(issue);
    }
  });
});

router.route('/issues/add').post((req, res) => {
  let issue = new Issue(req.body);
  issue
    .save()
    .then(issue => {
      res.status(200).json({ issue: 'Added successfully' });
    })
    .catch(err => {
      res.status(400).send('Failed to create new record');
    });
});

router.route('/issues/update/:id').put((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (!issue) {
      return next(new Error('Could not load document'));
    } else {
      issue.title = req.body.title;
      issue.responsible = req.body.responsible;
      issue.description = req.body.description;
      issue.severity = req.body.severity;
      issue.status = req.body.status;

      issue
        .save()
        .then(issue => {
          res.json('Update done');
        })
        .catch(err => {
          res.status(400).send('Update failed');
        });
    }
  });
});

router.route('/issues/delete/:id').delete((req, res) => {
  Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Removed successfully');
    }
  });
});

app.use('/', router);

app.listen(9201, () => console.log('Express server running on port 9201'));
