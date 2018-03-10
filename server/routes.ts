import * as express from 'express';

import UserCtrl from './controllers/user';
import AgentCtrl from './controllers/agent';
import MemberCtrl from './controllers/member';
import TopicCtrl from './controllers/topic';
import OrderCtrl from './controllers/order';
import User from './models/user';
import Agent from './models/agent';
import Member from './models/member';
import Topic from './models/topic';
import Order from './models/order';

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const agentCtrl = new AgentCtrl();
  const memberCtrl = new MemberCtrl();
  const topicCtrl = new TopicCtrl();
  const orderCtrl = new OrderCtrl();

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

  // Member
  router.route('/members').get(memberCtrl.getAll);
  router.route('/members/count').get(memberCtrl.count);
  router.route('/member').post(memberCtrl.insert);
  router.route('/member/:id').get(memberCtrl.get);
  router.route('/member/:id').put(memberCtrl.update);
  router.route('/member/:id').delete(memberCtrl.delete);

  // Topic
  router.route('/topics').get(topicCtrl.getAll);
  router.route('/topics/count').get(topicCtrl.count);
  router.route('/topic').post(topicCtrl.insert);
  router.route('/topic/:id').get(topicCtrl.get);
  router.route('/topic/:id').put(topicCtrl.update);
  router.route('/topic/:id').delete(topicCtrl.delete);
  router.route('/topic/import/:id').put(topicCtrl.importMarks);

  // Order
  router.route('/orders').get(orderCtrl.getAll);
  router.route('/orders/count').get(orderCtrl.count);
  router.route('/order/:id').get(orderCtrl.get);
  router.route('/order/:id').delete(orderCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
