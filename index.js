const express = require('express');
const async = require('async');
const config = require('./config');
const getAmqpConnection = require('./getAmqpConnection');
var amqp = require('amqplib/callback_api');

const registerWorker = require('./registerWorker');
const initializeJob = require('./workers/initializeJob');
const jobScheduler = require('./workers/jobScheduler');
const stageScheduler = require('./workers/stageScheduler');
const resultsProcessor = require('./workers/resultsProcessor');

registerWorker('qM', initializeJob);
registerWorker('scheduleJob', jobScheduler);
registerWorker('scheduleStage', stageScheduler);
registerWorker('results', resultsProcessor);

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require('body-parser').json());

app.post('/api/v1/jobs', (req, res) => {
  // listening to queue for stagesname and status
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = 'logs';

      ch.assertExchange(ex, 'fanout', {durable: false});

      ch.assertQueue('', {exclusive: true}, function(err, q) {
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        ch.bindQueue(q.queue, ex, '');

        ch.consume(q.queue, function(msg) {
          console.log(" [x] Live from queue %s", msg.content.toString());
        }, {noAck: true});
      });
    });
  });

  if(req.body.templateName || req.body.template) {
      console.log('Payload:', req.body);
      async.waterfall([
      getAmqpConnection,
      getAmqpChannel,
      (channel, callback) => {
        channel.assertQueue('qM', { durable: true });
        channel.sendToQueue('qM', new Buffer(JSON.stringify(req.body)), null);
        callback();
      }
    ], (err) => {
      if(err) { console.log('ERR: ', err); res.status(500).send('Could not create job.'); return; }
      res.send("Created");
    });
  }
  else {
    res.status(400).send('Request requires templateName');
    return;
  }
});

const port = config.PORT || 4070;
app.listen(port, () => {
  console.log('Express server listening on port: ', port);
});

let channel = null;
function getAmqpChannel(connection, callback) {
  if(channel) { callback(null, channel); return; }
  connection.createChannel((err, newChannel) => {
    if(err) { callback(err); return; }
    channel = newChannel;
    callback(null, channel);
  });
}


// amqp.connect('amqp://localhost', function(err, conn) {
//   conn.createChannel(function(err, ch) {
//     var ex = 'logs';
//
//     ch.assertExchange(ex, 'fanout', {durable: false});
//
//     ch.assertQueue('', {exclusive: true}, function(err, q) {
//       console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
//       ch.bindQueue(q.queue, ex, '');
//
//       ch.consume(q.queue, function(msg) {
//         console.log(" [x] %s", msg.content.toString());
//       }, {noAck: true});
//     });
//   });
// });
