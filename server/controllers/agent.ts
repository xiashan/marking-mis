import Agent from '../models/agent';
import BaseCtrl from './base';

import DBHelper from '../helper/db';

export default class AgentCtrl extends BaseCtrl {
  model = Agent;

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
}
