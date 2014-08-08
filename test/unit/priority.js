/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Priority = require('../../app/models/priority');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var p1, p2, p3;
var o1 = {name:'high', color:'#D63333', value:'3'};
var o2 = {name:'medium', color:'#FFFF59', value:'2'};
var o3 = {name:'low', color:'#4DB8FF', value:'1'};

describe('Priority', function(){
  before(function(done){
    dbConnect('priority-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Priority.collection.remove(function(){
      p1 = new Priority(o1);
      p2 = new Priority(o2);
      p3 = new Priority(o3);
      p1.save(function(){
        p2.save(function(){
          p3.save(function(){
            done();
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Priority object', function(){
      p1 = new Priority(o1);
      expect(p1).to.be.instanceof(Priority);
      expect(p1.name).to.equal('high');
      expect(p1.color).to.equal('#D63333');
    });
  });

  describe('#save', function(){
    it('should save a priority', function(done){
      p1 = new Priority(o1);
      p1.save(function(){
        expect(p1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.all', function(){
    it('should get all priorities from database', function(done){
      Priority.all(function(priorities){
        p1 = new Priority(o1);
        expect(priorities).to.have.length(3);
        expect(priorities[0]).to.be.instanceof(Priority);
        expect(priorities[0]).to.respondTo('save');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a priority by its id', function(done){
      Priority.findById(p1._id.toString(), function(priority){
        p1 = new Priority(o1);
        expect(priority.name).to.equal('high');
        expect(p1).to.be.instanceof(Priority);
        done();
      });
    });
  });

  // Last Braces //
});
