/**
 * Created by xiashan on 18/3/13.
 */
import * as fs from 'fs';
import Topic from '../models/topic';
import IconvHelper from '../helper/iconv';

export default class TopicService {
  model = Topic;

  /**
   * 解析标注者文件
   * @param filePath
   * @returns {Array}
   */
  parseMark = (filePath) => {
    return new Promise((resolve, reject) => {
      // 读取文件内容
      fs.readFile(filePath, (error, data) => {
        if (error) {
          return reject(error);
        }

        const text = IconvHelper.iconv2utf8(data);

        const markList = [];
        // 将文件按行拆成数组
        text.split(/\r?\n/).forEach((line, index) => {
          const arr = line.split(',');
          if (index > 0 && arr[0]) {
            markList.push({
              userId: arr[0],
              username: arr[1],
              donePageCount: arr[2],
              areaCount: arr[4],
              name: arr[6],
            });
          }
        });
        resolve(markList);
      });
    });
  }

  /**
   * 标注者保存到数据库
   * @param topicId
   * @param markList
   * @returns {Promise<T>}
   */
  saveDB = (topicId, markList) => {
    return new Promise((resolve, reject) => {
      this.model.update({ _id: topicId }, { marks: markList }, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  findTopicByIds = (ids) => {
    return new Promise((resolve, reject) => {
      this.model.find({
        _id: { $in: ids }
      }, (err, topics) => {
        if (err) { return reject(err); }
        resolve(topics);
      });
    });
  }

  getTopicMembers = (topics) => {
    // 获取所有的memberBid
    return new Promise((resolve, reject) => {
      if (!topics || topics.length === 0) {
        return reject();
      }
      let memberBids = [];
      topics.forEach(topic => {
        topic.marks.forEach(mark => {
          memberBids.push(mark.userId);
        });
      });
      memberBids = memberBids.filter((bid, index, self) => {
        return self.indexOf(bid) === index;
      });
      resolve(memberBids);
    });
  }

  updateSettleStatus = (orderInfo, status) => {
    return new Promise((resolve, reject) => {
      this.model.update({
        _id: { $in: orderInfo.topicList}
      }, { settle: status }, { multi: true }, (err, topics) => {
        if (err) { return reject(err); }
        resolve(topics);
      });
    });
  }
}


