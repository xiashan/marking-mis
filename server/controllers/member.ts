import Member from '../models/member';
import BaseCtrl from './base';

import DBHelper from '../helper/db';

export default class MemberCtrl extends BaseCtrl {
  model = Member;

  getAll = (req, res) => {
    const { bid, username, name, _agent, pageNum = '1', pageSize = '10' } = req.query;
    const filter: any = {};
    if (bid) {
      filter.bid = bid;
    }
    if (username) {
      filter.username = new RegExp(username);
    }
    if (name) {
      filter.name = new RegExp(name);
    }
    if (_agent) {
      filter._agent = _agent;
    }

    const callback = (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    };

    DBHelper.pageQuery(parseInt(pageNum, 10),
      parseInt(pageSize, 10),
      this.model,
      '_agent',
      filter,
      '-updatedAt',
      '_id bid username name _agent',
      callback);
  }
}
