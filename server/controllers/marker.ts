import Marker from '../models/marker';
import BaseCtrl from './base';
import async from 'async';

export default class MarkerCtrl extends BaseCtrl {
  model = Marker;

  getAll = (req, res) => {
    console.log(typeof async.parallel);
    const param = req.query;
    const filter = {};
    if (param.bid) {
      filter.bid = param.bid;
    }
    if (param.username) {
      filter.username = new RegExp(param.username);
    }
    if (param.name) {
      filter.name = new RegExp(param.name);
    }
    if (param.agent) {
      filter.agent = param.agent;
    }

    const limit = param.pageSize ? parseInt(param.pageSize, 10) : 10;
    const start = param.pageNum ? (param.pageNum - 1) * limit : 0;
    const callback = (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    };

    const query = this.model.find(filter).populate('agent');
    // 代理商，population
    query
      .skip(start)
      .limit(limit)
      .exec(callback);

    query.count((err, count) => {
      if (err) { return console.error(err); }
      console.log(count);
    });
  }
}
