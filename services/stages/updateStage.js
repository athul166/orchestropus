const async = require('async');
const client = require('../../redisClient').duplicate();
var amqp = require('amqplib/callback_api');

module.exports = function(jobId, stageName, stage, callback) {
  const stagesKey = jobId + ':stages';

  //  Publising stages and status to the queue
  var str = "{ \"jobId\" : \""+jobId+"\", \"stageName\" : \""+stageName+"\", \"stages\": "+JSON.stringify(stage)+" }";
  //console.log(str);
  //var result = JSON.stringify(eval("(" + str + ")"));
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = 'logs';
      //var msg = process.argv.slice(2).join(' ') || 'Hello World!';

      ch.assertExchange(ex, 'fanout', {durable: false});
      ch.publish(ex, '', new Buffer(str));
      console.log(" [x] Sent %s", str);
    });
  });
  // FIXME: For correct implementation, need to Retrieve, Patch, and update, with version control checks.
  //console.log("STAGE NAME ===>"+stageName+" Stage===> "+JSON.stringify(str.jobId));
  client.hset(stagesKey, stageName, JSON.stringify(stage), callback);
};
