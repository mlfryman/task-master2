/* jshint expr:true */
/* global describe, it, before, beforeEach */
'use strict';

var expect = require('chai').expect;
var Task = require('../../app/models/task');
var Priority = require('../../app/models/priority');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var p1, p2, p3;
var o1 = {name:'high', color:'#D63333', value:'3'};
var o2 = {name:'medium', color:'#FFFF59', value:'2'};
var o3 = {name:'low', color:'#4DB8FF', value:'1'};

var t1, t2, t3, t4, t5, t6;
var to1 = {name:'comcast', due:'9/1/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/comcast-icon.jpg', tags:'bill, utility, internet'};

describe('Task', function(){
  before(function(done){
    dbConnect('task-test', function(){
      done();
    });
  });
  beforeEach(function(done){
    Priority.collection.remove(function(){
      Task.collection.remove(function(){
        p1 = new Priority(o1);
        p2 = new Priority(o2);
        p3 = new Priority(o3);
        p1.save(function(){
          p2.save(function(){
            p3.save(function(){
              var to1 = {name:'comcast', due:'9/1/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/comcast-icon.jpg', tags:'bill, utility, internet', priorityId:p1._id.toString()};
              var to2 = {name:'nashville electric service', due:'8/15/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/nesLogo-icon.jpg', tags:'bill, electricity, utility', priorityId:p2._id.toString()};
              var to3 = {name:'at&t ', due:'8/8/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/att.jpg', tags:'bill, utility, phone', priorityId:p3._id.toString()};
              var to4 = {name:'banfield', due:'9/15/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/banfield.jpg', tags:'bill, pet, medical', priorityId:p1._id.toString()};
              var to5 = {name:'netflix', due:'8/30/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/netflix-logo.jpg', tags:'bill, entertainment', priorityId:p2._id.toString()};
              var to6 = {name:'github', due:'8/10/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/github-logo.jpg', tags:'bill, web service, work', priorityId:p3._id.toString()};
              t1 = new Task(to1);
              t2 = new Task(to2);
              t3 = new Task(to3);
              t4 = new Task(to4);
              t5 = new Task(to5);
              t6 = new Task(to6);
              t1.isComplete = true;
              t1.save(function(){
                t2.save(function(){
                  t3.save(function(){
                    t4.save(function(){
                      t5.save(function(){
                        t6.save(function(){
                          done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a task with proper attributes', function(){
      t1 = new Task(to1);
      expect(t1).to.be.instanceof(Task);
      expect(t1.name).to.equal('comcast');
      expect(t1.due).to.respondTo('getDay');
      expect(t1.photo).to.equal('https://dl.dropboxusercontent.com/u/1699691/Task%20Master/comcast-icon.jpg');
      expect(t1.tags).to.have.length(3);
      expect(t1.isComplete).to.be.false;
      expect(t1.priorityId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('#save', function(){
    it('should save a new task', function(done){
      to1 = {name:'comcast', due:'9/1/2014', photo:'https://dl.dropboxusercontent.com/u/1699691/Task%20Master/comcast-icon.jpg', tags:'bill, utility, internet', priorityId: p1._id.toString()};
      t1 = new Task(to1);
      t1.save(function(){
        expect(t1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.update', function(){
    it('should set task\'s completed status to true in database', function(done){
      Task.update(t1._id.toString(), {completed:'true'}, function(){
        Task.findById(t1._id.toString(), function(task){
          expect(task.isComplete).to.be.true;
          done();
        });
      });
    });

    it('should set task\'s completed status to false in database', function(done){
      Task.update(t2._id.toString(), {}, function(){
        Task.findById(t2._id.toString(), function(task){
          expect(task.isComplete).to.be.false;
          done();
        });
      });
    });
  });

  describe('.all', function(){
    it('should get all tasks from database', function(done){
      Task.all(function(tasks){
        t1 = new Task(to1);
        expect(tasks).to.have.length(6);
        expect(tasks[0]).to.be.instanceof(Task);
         expect(tasks[0]).to.respondTo('save');
         expect(tasks[0].priority).to.be.instanceof(Priority);
         expect(tasks[0].priority.name).to.equal('High');
         console.log(tasks);
        done();
      });
    });
  });
  describe('.findById', function(){
    it('should find a task by its id', function(done){
      Task.findById(t1._id.toString(), function(task){
        t1 = new Task(to1);
        expect(task.name).to.equal('comcast');
        expect(t1).to.be.instanceof(Task);
        done();
      });
    });
  });

// Last Braces //
});
