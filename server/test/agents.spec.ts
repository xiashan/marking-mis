import * as chai from 'chai';
import * as chaiHttp from 'chai-http';

process.env.NODE_ENV = 'test';
import { app } from '../app';
import Agent from '../models/agent';

const should = chai.use(chaiHttp).should();

describe('Agents', () => {

  beforeEach(done => {
    Agent.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for agents', () => {

    it('should get all the agents', done => {
      chai.request(app)
        .get('/api/agents')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get agents count', done => {
      chai.request(app)
        .get('/api/agents/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new agent', done => {
      const agent = new Agent({ name: 'Fluffy', weight: 4, age: 2 });
      chai.request(app)
        .post('/api/agent')
        .send(agent)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('name');
          res.body.should.have.a.property('weight');
          res.body.should.have.a.property('age');
          done();
        });
    });

    it('should get a agent by its id', done => {
      const agent = new Agent({ name: 'Agent', weight: 2, age: 4 });
      agent.save((error, newAgent) => {
        chai.request(app)
          .get(`/api/agent/${newAgent.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('weight');
            res.body.should.have.property('age');
            res.body.should.have.property('_id').eql(newAgent.id);
            done();
          });
      });
    });

    it('should update a agent by its id', done => {
      const agent = new Agent({ name: 'Agent', weight: 2, age: 4 });
      agent.save((error, newAgent) => {
        chai.request(app)
          .put(`/api/agent/${newAgent.id}`)
          .send({ weight: 5 })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a agent by its id', done => {
      const agent = new Agent({ name: 'Agent', weight: 2, age: 4 });
      agent.save((error, newAgent) => {
        chai.request(app)
          .delete(`/api/agent/${newAgent.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


