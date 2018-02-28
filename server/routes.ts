import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import AgentCtrl from './controllers/agent';
import MarkerCtrl from './controllers/marker';
import SuitCtrl from './controllers/suit';
import Cat from './models/cat';
import User from './models/user';
import Agent from './models/agent';
import Marker from './models/marker';
import Suit from './models/suit';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const agentCtrl = new AgentCtrl();
  const markerCtrl = new MarkerCtrl();
  const suitCtrl = new SuitCtrl();

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Agent
  router.route('/agents').get(agentCtrl.getAll);
  router.route('/agents/count').get(agentCtrl.count);
  router.route('/agent').post(agentCtrl.insert);
  router.route('/agent/:id').get(agentCtrl.get);
  router.route('/agent/:id').put(agentCtrl.update);
  router.route('/agent/:id').delete(agentCtrl.delete);

  // Marker
  router.route('/markers').get(markerCtrl.getAll);
  router.route('/markers/count').get(markerCtrl.count);
  router.route('/marker').post(markerCtrl.insert);
  router.route('/marker/:id').get(markerCtrl.get);
  router.route('/marker/:id').put(markerCtrl.update);
  router.route('/marker/:id').delete(markerCtrl.delete);

  // Suit
  router.route('/suits').get(suitCtrl.getAll);
  router.route('/suits/count').get(suitCtrl.count);
  router.route('/suit').post(suitCtrl.insert);
  router.route('/suit/:id').get(suitCtrl.get);
  router.route('/suit/:id').put(suitCtrl.update);
  router.route('/suit/:id').delete(suitCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
