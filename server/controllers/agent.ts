import Agent from '../models/agent';
import Member from '../models/member';
import BaseCtrl from './base';

import DBHelper from '../helper/db';

export default class AgentCtrl extends BaseCtrl {
  model = Agent;
  memberModel = Member;

  getAll = (req, res) => {
    const { pageNum = '1', pageSize = '10' } = req.query;
    const filter: any = {};

    const callback = (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    };

    DBHelper.pageQuery(parseInt(pageNum, 10),
      parseInt(pageSize, 10),
      this.model,
      '',
      filter,
      '-updatedAt',
      '_id name price discountPrice',
      callback);
  }

  delete = (req, res) => {
    const deleteAgents = (id) => {
      return new Promise((resolve, reject) => {
        this.model.findOneAndRemove({ _id: id }, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    };

    const deleteMembers = (id) => {
      return new Promise((resolve, reject) => {
        this.memberModel.remove({ _agent: id }, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    };

    const deleteAll = async (id) => {
      const agentRes =  await deleteAgents(id);
      return await deleteMembers(id);
    };

    deleteAll(req.params.id).then(result => {
      res.sendStatus(200);
    }, err => {
      console.error(err);
    });
  }
}
