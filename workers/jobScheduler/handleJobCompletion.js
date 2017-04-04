const async = require('async');
var amqp = require('amqplib/callback_api');

module.exports = function(jobId, stages, a, done) {
  const stageNames = Object.keys(stages);
  const isJobComplete = stageNames.every((stageName) => {
    const stage = stages[stageName];
    return ['Completed', 'Failed', 'Blocked'].indexOf(stage.status) >= 0;
  });

 console.log('JOB COMPLETED:', isJobComplete);
  var result=JSON.stringify(isJobComplete);
  // amqp.connect('amqp://localhost', function(err, con) {
  //   con.createChannel(function(err, ch) {
  //     var ex = 'jobstatus';
  //
  //
  //    ch.assertExchange(ex, 'fanout', {durable: false});
  //     ch.publish(ex,'', new Buffer(result));
  //
  //  });
  // });
  done();
};
