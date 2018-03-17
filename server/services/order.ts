/**
 * Created by xiashan on 18/3/14.
 */
import Order from '../models/order';

export default class OrderService {
  model = Order;

  calcOrder = (topics, members) => {
    if (!topics || !members) {
      return false;
    }
    const name = [];
    const topicList = [];
    const agentList: any = {};
    const memberList: any = {};
    let totalAreaCount = 0;

    // 依次处理每个题包
    topics.forEach(topic => {
      name.push(topic.shortName);
      topicList.push(topic._id);
      totalAreaCount += topic.total;
      const priceField = topic.withhold ? 'discountPrice' : 'price';
      // 依次处理每个标注
      topic.marks.forEach(mark => {
        // 数据不存在进行初始化
        if (!memberList[mark.userId]) {
          memberList[mark.userId] = {
            userId: mark.userId,
            username: mark.username,
            name: mark.name,
            areaCount: 0,
            income: 0,
            isBelong: false,
          };
        }
        memberList[mark.userId].areaCount += mark.areaCount;
        // 有代理再特别增加代理信息
        if (members[mark.userId]) {
          memberList[mark.userId]._member = members[mark.userId]._id;
          memberList[mark.userId]._agent = members[mark.userId]._agent._id;
          memberList[mark.userId].isBelong = true;
          memberList[mark.userId].income += (mark.areaCount * (members[mark.userId]._agent[priceField]));

          // 增加代理信息
          const agentId = members[mark.userId]._agent._id;
          const agentName = members[mark.userId]._agent.name;
          if (!agentList[agentId]) {
            agentList[agentId] = {
              _agent: agentId,
              name: agentName,
              areaCount: 0,
              income: 0,
            };
          }
          agentList[agentId].areaCount += mark.areaCount;
          agentList[agentId].income += (mark.areaCount * (members[mark.userId]._agent[priceField]));
        }
      });
    });

    return {
      orderName: name.join('-'),
      topicList: topicList,
      totalAreaCount: totalAreaCount,
      agentList: agentList,
      memberList: memberList,
    };
  }

  getOrderInfo = (topics, members) => {
    // 返回list信息
    return new Promise((resolve, reject) => {
      const res = this.calcOrder(topics, members);
      if (!res) {
        return reject(res);
      }
      resolve(res);
    });
  }

  getOrder = (id) => {
    return new Promise((resolve, reject) => {
      this.model.findOne({ _id: id }, (err, res) => {
        if (err) { return reject(err); }
        resolve(res);
      });
    });
  }

  saveOrder = (orderInfo) => {
    return new Promise((resolve, reject) => {
      const settle = {
        name: orderInfo.orderName,
        topicList: orderInfo.topicList,
        areaCount: orderInfo.totalAreaCount,
        memberList: Object.keys(orderInfo.memberList).map(item => orderInfo.memberList[item]),
        agentList: Object.keys(orderInfo.agentList).map(item => orderInfo.agentList[item]),
      };
      const obj = new this.model(settle);
      obj.save((err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  deleteOrder = (id) => {
    return new Promise((resolve, reject) => {
      this.model.findOneAndRemove({ _id: id }, (err, res) => {
        if (err) { return reject(err); }
        resolve(res);
      });
    });
  }
}
