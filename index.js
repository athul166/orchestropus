const express = require('express');
const async = require('async');
const config = require('./config');
const getAmqpConnection = require('./getAmqpConnection');
var amqp = require('amqplib/callback_api');
var Jobs=require('./models/jobs');
//var mongo=require('mongodb');
var mongo=require('mongodb');
var url = "mongodb://localhost:27017/workflowsandlanpacks";

const app = express();
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var server = require('http').Server(app);
var io = require('socket.io')(server, {origin: allowedOrigins});

const registerWorker = require('./registerWorker');
const initializeJob = require('./workers/initializeJob');
const jobScheduler = require('./workers/jobScheduler');
const stageScheduler = require('./workers/stageScheduler');
const resultsProcessor = require('./workers/resultsProcessor');

registerWorker('qM', initializeJob);
registerWorker('scheduleJob', jobScheduler);
registerWorker('scheduleStage', stageScheduler);
registerWorker('results', resultsProcessor);

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
        //console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        ch.bindQueue(q.queue, ex, '');

        ch.consume(q.queue, function(msg) {
          var result=JSON.parse(msg.content.toString());
      //     amqp.connect('amqp://localhost', function(err, conn) {
      //     conn.createChannel(function(err, ch) {
      //       var ex = 'jobstatus';
      //
      //      ch.assertExchange(ex, 'fanout', {durable: false});
      //
      //      ch.assertQueue('', {exclusive: true}, function(err, q) {
      // //        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      //         ch.bindQueue(q.queue, ex, '');
      //
      //        ch.consume(q.queue, function(msg) {
      //          var status = msg.content.toString();
      //          console.log("===>jobstatus"+status);
      //          io.emit('status',status);
      //           }, {noAck: true});
      //       });
      //     });
      //   });
        //console.log(" [x] Live from queue %s", msg.content.toString());

          io.emit('result',result);
          delete1(result.jobId)

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
});
var delete1 = function delete1(id){
          mongo.connect(url, function(err, db) {
           if (err) {
               console.log('---- DB connection error <<=== ' + err + ' ===>>');
           } else {
               db.collection('jobs').deleteOne({
                   jobId:id
               }, function(err, result) {
                   if (err) {
                       console.log('---- DB deletion error <<=== ' + err + ' ===>>');
                   } else {
                      // console.log("+-+- Workflow delete status(+1-0) <<=== " + result.result.n + " ===>>");
                      // res.send('Successfully deleted.');
                      add(id);
                      db.close();
                   }
               }); // end of delete
           }
       });
}

var add = function add(id){
			 var item={
									 jobId: id
			 };
			 mongo.connect(url,function(err,db)
			 {
					 db.collection('jobs').insertOne(item,function(err, result) {
									 if (err) {
											 console.log('---- DB add error <<=== ' + err + ' ===>>');
									 } else {
											 db.close();
									 }
							 })
			});
	 }

const port = config.PORT || 4070;
server.listen(port, () => {
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
