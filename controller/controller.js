var Jobs=require('./../models/jobs');
const yaml = require('js-yaml');
//var mongo=require('mongodb');
var mongo=require('mongodb');
var url = "mongodb://localhost:27017/workflowsandlanpacks";


var get=function(req,res){
	var tag=req.query.search_item;
	console.log("tagsss   "+tag);
	var t=tag.split(',');
	console.log(t);
 	Workflow.find({ $or :[{"tags":{"$all":t}},{"workflow_name":t}]},function(err,docs){
    if(err){
			res.status(500);
			res.send("Internal errr");
			}
			else{
					console.log("result of server ");
					//console.log(docs);
					res.json(docs);
			}
	})
}


var get1=function(req,res){
	var name=req.query.name;
	console.log("name   "+name);

 	Workflow.find({"workflow_name":name},function(err,docs){
    if(err){
			res.status(500);
			res.send("Internal errr");
			}
			else{
					console.log("result of server ");
					console.log(docs);
					res.json(docs);
			}
	})
}
// var add=function(req,res){
//    var movie=new Movie(req.body);
//    movie.save(function(err){
//    	if(err){
//    		res.status(500);
//    		res.send("Failed");
//    	}
//    	else
//    	{
//    		res.status(201);
//    		res.send(movie);
//    	}
//  })
// }
var add = function(req,res){
			 var jobs = new Jobs(req.body);
			 console.log(req.body);
			 var item={
									 jobId: req.body.jobId,
									 status: req.body.status
			 };
			 mongo.connect(url,function(err,db)
			 {
					 db.collection('jobs').insertOne(item,function(err, result) {
									 if (err) {
											 console.log('---- DB add error <<=== ' + err + ' ===>>');
									 } else {
											 console.log("+-+- Workflow add status(+1-0) <<=== " + result.result.n + " ===>>");
											 res.send('Successfully added.');
											 db.close();
									 }
							 })



					 });


	 }

	 var delete = function(req,res){

             mongo.connect(url, function(err, db) {
        if (err) {
            console.log('---- DB connection error <<=== ' + err + ' ===>>');
        } else {
            db.collection('jobs').deleteOne({
                jobId: req.body.jobId
            }, function(err, result) {
                if (err) {
                    console.log('---- DB deletion error <<=== ' + err + ' ===>>');
                } else {
                    console.log("+-+- Workflow delete status(+1-0) <<=== " + result.result.n + " ===>>");
                    res.send('Successfully deleted.');
                    db.close();
                }
            }); // end of delete
        }
    });
  }
module.exports={
  	 add:add,
  	get:get,
		delete1:delete1,
		get1:get1
  }
