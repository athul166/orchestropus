const nid = require('nid');
const async = require('async');
const retrieveTemplate = require('../../services/template/retrieveTemplate');

const initializeContext = require('./initializeContext');
const initializePayload = require('./initializePayload');
const initializeStages = require('./initializeStages');
const scheduleJob = require('../../services/job/scheduleJob');

module.exports = function({payload, template, templateName}, callback) {

  const jobId = templateName+"_"+nid(8);

    async.parallel([
    initializeContext.bind(null, jobId),
    initializePayload.bind(null, jobId, payload),
    initializeStages.bind(null, jobId, template),
  ],(err, results) => {
    if(err) { callback(err); return null; }
    console.log("MSG =====> "+results.toString());
    scheduleJob(jobId, callback);
  });
};


// function initializeJob(template, payload) {
//
// }
