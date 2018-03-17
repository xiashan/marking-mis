import Topic from '../models/topic';
import BaseCtrl from './base';
import DBHelper from '../helper/db';
import HttpHelper from '../helper/http';

export default class TopicCtrl extends BaseCtrl {
  model = Topic;

  getAll = (req, res) => {
    const { no, shortName, settle, pageNum = '1', pageSize = '10' } = req.query;
    const filter: any = {};
    if (no) {
      filter.no = no;
    }

    if (shortName) {
      filter.shortName = shortName;
    }

    console.log(typeof settle);
    if (settle) {
      filter.settle = settle;
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
      '-updatedAt',
      '_id no name shortName total assessment passTime marks',
      callback);
  }

  importMarks = (req, res) => {
    const topicId = req.params.id;
    const callback = (err, list) => {
      if (err) { return console.error(err); }

      // 把list插入数据库
      const arr = list.map(item => ({
        userId: item.user_id,
        username: item.user_name,
        name: item.tag,
        donePageCount: item.done_page_count,
        areaCount: item.area_count,
      }));

      this.model.update({ _id: topicId }, { marks: arr }, (error, docs) => {
        if (err) { return console.error(error); }
        // 返回结果，总的标注数量
        res.status(200).json(arr);
      });
    };

    // 获取topic详情，主要是ID
    this.model.findOne({ _id: topicId }, (err, item) => {
      if (err) {
        return console.error(err);
      }

      // 抓取数据
      HttpHelper.getMarkList(item.no, callback);
    });

  }
}
