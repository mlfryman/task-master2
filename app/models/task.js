'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');
var async = require('async');
var Priority = require('./priority');

Object.defineProperty(Task, 'collection', {
  get: function(){return global.mongodb.collection('tasks');}
});

function Task(t){
  this.name = t.name;
  this.due = new Date(t.due);
  this.photo = t.photo;
  this.tags = t.tags.split(',').map(function(s){return s.trim();});
  this.priorityId = Mongo.ObjectID(t.priorityId);
  this.isComplete = false;
}

Task.prototype.save = function(cb){
  Task.collection.save(this, cb);
};

Task.update = function(id, obj, cb){
  var _id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  var val = (obj.completed) ? true : false;
  Task.collection.update({_id:_id}, {$set:{isComplete:val}}, cb);
};

Task.all = function(cb){
  Task.collection.find().toArray(function(err, objects){
    var tasks = objects.map(function(o){
      return changePrototype(o);
    });
    async.map(tasks, function(task, cb4){
      Priority.findById(task.priorityID.toString(), function(priority){
        task.priority = priority;
        cb4(null, task);
      });
    },
    function(err, newTasks){
      cb(newTasks);
    });
  });
};

Task.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Task.collection.findOne({_id:_id}, function(err, obj){
    var task = changePrototype(obj);
    cb(task);
  });
};

module.exports = Task;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  return _.create(Task.prototype, obj);
}
