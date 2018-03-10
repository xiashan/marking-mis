/**
 * Created by xiashan on 18/2/28.
 */
import async from 'async';

export default class DBHelper {
  static pageQuery = (pageNum: number,
                      pageSize: number,
                      Model: any,
                      populate: string,
                      queryParams: any,
                      sortParams: string,
                      selectedFields: string,
                      callback: any) => {
    const start: number = (pageNum - 1) * pageSize;
    const $page: any = {
      pageNum: pageNum,
    };
    async.parallel({
      count: (done) => { // 查询数量
        Model.count(queryParams)
          .exec((err, count) => {
            done(err, count);
          });
      },
      records: (done) => { // 查询一页的记录
        Model.find(queryParams)
          .sort(sortParams)
          .skip(start)
          .limit(pageSize)
          .populate(populate)
          .exec((err, records) => {
            done(err, records);
          });
      }
    }, (err, results) => {
      $page.totalRecord = results.count;
      $page.retData = results.records;
      callback(err, $page);
    });
  }
}
