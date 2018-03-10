/**
 * Created by xiashan on 18/3/5.
 */
import Order from '../models/order';
import Topic from '../models/topic';
import Member from '../models/member';
import Agent from '../models/agent';
import BaseCtrl from './base';

import DBHelper from '../helper/db';

export default class OrderCtrl extends BaseCtrl {
  model = Order;
  topicModel = Topic;
  memberModel = Member;
  agentModel = Agent;

  insert = (req, res) => {
    const topicId = req.body.topicId;

    // 获取所有的member信息
    const getMembers = (memberBids) => {
      return new Promise((resolve, reject) => {
        this.memberModel
          .find({
            bid: { $in: memberBids }
          })
          .populate('_agent')
          .exec((err, members) => {
            if (err) {
              return reject(err);
            }
            const result = {};
            members.forEach(member => result[member.bid] = member);
            resolve(result);
          });
      });
    };

    const getTopicIncome = async (memberBids) => {
      return await getMembers(memberBids);
    };

    const computeIncome = (topics) => {
      const name = [];
      const agentList: any = {};
      const memberList: any = {};
      let memberObj: any = {};
      let totalIncome = 0;
      let totalAreaCount = 0;

      // 获取所有的memberBid
      let memberBids = [];
      topics.forEach(topic => {
        topic.marks.forEach(mark => {
          memberBids.push(mark.userId);
        });
      });
      memberBids = memberBids.filter((bid, index, self) => {
        return self.indexOf(bid) === index;
      });

      getTopicIncome(memberBids).then(result => {
        memberObj = result;
        topics.forEach(topic => {
          name.push(topic.shortName);
          totalAreaCount += topic.total;
          totalIncome += topic.assessment * topic.total;
          const priceField = topic.assessment === 13 ? 'price' : 'discountPrice';
          topic.marks.forEach(mark => {
            // members
            if (!memberObj[mark.userId]) {
              // 如果没有所属代理
              if (memberList[mark.userId]) {
                memberList[mark.userId].areaCount += mark.areaCount;
              } else {
                memberList[mark.userId] = {
                  userId: mark.userId,
                  username: mark.username,
                  name: mark.name,
                  areaCount: mark.areaCount,
                  isBelong: false,
                };
              }
            } else {
              // 有所属代理
              if (memberList[mark.userId]) {
                memberList[mark.userId].areaCount += mark.areaCount;
                memberList[mark.userId].income += mark.areaCount * (memberObj[mark.userId]._agent[priceField]);
              } else {
                memberList[mark.userId] = {
                  _member: memberObj[mark.userId]._id,
                  userId: mark.userId,
                  username: mark.username,
                  name: mark.name,
                  areaCount: mark.areaCount,
                  income: mark.areaCount * (memberObj[mark.userId]._agent[priceField]),
                  isBelong: true,
                };
              }
            }

            // agents
            if (memberObj[mark.userId]) {
              const agentId = memberObj[mark.userId]._agent._id;
              const agentName = memberObj[mark.userId]._agent.name;
              if (agentList[agentId]) {
                agentList[agentId].areaCount += mark.areaCount;
                agentList[agentId].income += mark.areaCount * (memberObj[mark.userId]._agent[priceField]);
              } else {
                agentList[agentId] = {
                  _agent: agentId,
                  name: agentName,
                  areaCount: mark.areaCount,
                  income: mark.areaCount * (memberObj[mark.userId]._agent[priceField]),
                };
              }
            }

          });
        });
        const settle = {
          name: name.join(','),
          income: totalIncome,
          areaCount: totalAreaCount,
          memberList: Object.keys(memberList).map(item => memberList[item]),
          agentList: Object.keys(agentList).map(item => memberList[item]),
        };
        const obj = new this.model(settle);
        obj.save((err, item) => {
          // 11000 is the code for duplicate key error
          if (err && err.code === 11000) {
            res.sendStatus(400);
          }
          if (err) {
            return console.error(err);
          }
          res.sendStatus(200);
        });
      });
    };

    // 获取所有的marks
    this.topicModel.find({
      _id: { $in: topicId }
    }, (err, topics) => {
      if (err) { return console.error(err); }
      computeIncome(topics);
    });

  }
}
