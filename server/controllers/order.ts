/**
 * Created by xiashan on 18/3/5.
 */
import Order from '../models/order';
import BaseCtrl from './base';

import TopicService from '../services/topic';
import MemberService from '../services/member';
import OrderService from '../services/order';
import AgentService from '../services/agent';

import DBHelper from '../helper/db';
import IconvHelper from '../helper/iconv';

export default class OrderCtrl extends BaseCtrl {
  model = Order;

  getAll = (req, res) => {
    const { name, pageNum = '1', pageSize = '10' } = req.query;
    const filter: any = {};
    if (name) {
      filter.name = name;
    }

    const callback = (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    };

    DBHelper.pageQuery(parseInt(pageNum, 10),
      parseInt(pageSize, 10),
      this.model,
      '',
      filter,
      '',
      '_id name areaCount memberList agentList',
      callback);
  }

  insert = (req, res) => {
    const topicId = req.body.topicId;

    const topicService = new TopicService();
    const memberService = new MemberService();
    const orderService = new OrderService();

    const save = async () => {
      const topics = await topicService.findTopicByIds(topicId);
      const memberBids = await topicService.getTopicMembers(topics);
      const members = await memberService.getMemberByBids(memberBids);
      const orderInfo = await orderService.getOrderInfo(topics, members);
      const saveOrder =  await orderService.saveOrder(orderInfo);
      const updateTopic =  await topicService.updateSettleStatus(orderInfo, true);
      return true;
    };

    save().then((result) => {
      res.sendStatus(200);
    }, err => {
      return console.error(err);
    });
  }

  delete = (req, res) => {
    const orderService = new OrderService();
    const topicService = new TopicService();
    const id = req.params.id;
    const deleteOrder = async () => {
      const orderInfo = await orderService.getOrder(id);
      // 删除order
      const dt = await orderService.deleteOrder(id);
      // 更新topic的状态
      const tp = await topicService.updateSettleStatus(orderInfo, false);
      return true;
    };
    deleteOrder().then(result => {
      res.sendStatus(200);
    }, err => {
      return console.error(err);
    });
  }

  getMembers = (req, res) => {
    const id = req.params.id;
    const { bid, username, name, _agent, pageNum = 1, pageSize = 10 } = req.query;

    const orderService = new OrderService();
    const agentService = new AgentService();

    const getData = async () => {
      const agents: any = await agentService.getList();
      const order: any = await orderService.getOrder(id);
      return { agents, order };
    };

    getData().then(result => {
      const agents = result.agents;
      let memberList = result.order.memberList;
      // 做筛选
      if (bid) {
        memberList = memberList.filter(item => item.userId === String(bid));
      }
      if (username) {
        memberList = memberList.filter(item => item.username.indexOf(username) >= 0 );
      }
      if (name) {
        memberList = memberList.filter(item => item.name.indexOf(name) >= 0);
      }
      if (_agent) {
        if (_agent === '-1') {
          memberList = memberList.filter(item => !item._agent);
        } else {
          memberList = memberList.filter(item => item._agent == _agent);
        }
      }
      const totalRecord = memberList.length;
      memberList = memberList.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      const retData = [];
      // TODO 不能直接往item赋值，why？？？
      memberList.forEach(item => {
        const obj = {
          userId: item.userId,
          username: item.username,
          name: item.name,
          areaCount: item.areaCount,
          income: item.income,
          isBelong: item.isBelong,
          agent: item._agent ? agents[item._agent].name : '',
        };
        retData.push(obj);
      });
      const orderData = {
        _id: result.order._id,
        name: result.order.name,
      };
      res.status(200).json({
        pageNum: pageNum,
        totalRecord,
        orderData,
        retData,
      });
    }, error => {
      return console.error(error);
    });
  }

  exportMembers = (req, res) => {
    const orderService = new OrderService();
    const agentService = new AgentService();

    const id = req.params.id;
    const { bid, username, name, _agent } = req.query;

    const getData = async () => {
      const agents: any = await agentService.getList();
      const order: any = await orderService.getOrder(id);
      return { agents, order };
    };

    getData().then(result => {
      const agents = result.agents;
      let memberList = result.order.memberList;
      // 做筛选
      if (bid) {
        memberList = memberList.filter(item => item.userId === String(bid));
      }
      if (username) {
        memberList = memberList.filter(item => item.username.indexOf(username) >= 0 );
      }
      if (name) {
        memberList = memberList.filter(item => item.name.indexOf(name) >= 0);
      }
      if (_agent) {
        if (_agent === '-1') {
          memberList = memberList.filter(item => !item._agent);
        } else {
          memberList = memberList.filter(item => item._agent == _agent);
        }
      }

      const head = ['userId', 'username', 'name', 'areaCount', 'income', '_agent'];
      const body = [head];

      memberList.forEach((item) => body.push([
        item[head[0]], item[head[1]], item[head[2]], item[head[3]], item[head[4]].toFixed(2), item[head[5]] ? agents[item[head[5]]].name : '',
      ]));
      const content = body.reduce( (accumulator, currentValue) => `${accumulator}${currentValue.join(',')}\n`, '');
      res.setHeader('Content-disposition', `attachment; filename='${result.order.name}-member.csv'`);
      res.setHeader('Content-type', 'text/csv; charset=GBK');
      res.end(IconvHelper.iconv2gbk(content));
    }, error => {
      return console.error(error);
    });
  }

  exportAgents = (req, res) => {
    const orderService = new OrderService();
    const id = req.params.id;
    orderService.getOrder(id).then((result: any) => {
      const head = ['name', 'areaCount', 'income'];
      const body = [head];
      result.agentList.forEach((item) => body.push([item[head[0]], item[head[1]], item[head[2]].toFixed(2)]));
      const content = body.reduce( (accumulator, currentValue) => `${accumulator}${currentValue.join(',')}\n`, '');
      res.setHeader('Content-disposition', `attachment; filename='${result.name}-agent.csv'`);
      res.setHeader('Content-type', 'text/csv; charset=GBK');
      res.end(IconvHelper.iconv2gbk(content));
    }, error => {
      return console.error(error);
    });
  }
}
