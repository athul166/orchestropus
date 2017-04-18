const async = require('async');
var amqp = require('amqplib/callback_api');

module.exports = function(jobId, stages, a, done) {
  const stageNames = Object.keys(stages);
  const isJobComplete = stageNames.every((stageName) => {
    const stage = stages[stageName];
    return ['Completed', 'Failed', 'Blocked'].indexOf(stage.status) >= 0;
  });

  console.log('JOB COMPLETED:', isJobComplete);
  done();
};
