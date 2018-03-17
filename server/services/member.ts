/**
 * Created by xiashan on 18/3/14.
 */
import Member from '../models/member';

export default class MemberService {
  model = Member;

  getMemberByBids = (bids) => {
    return new Promise((resolve, reject) => {
      this.model
        .find({
          bid: { $in: bids }
        })
        .populate('_agent')
        .exec((err, members) => {
          if (err) {
            return reject(err);
          }
          const result = {};
          // 转换成以bid为key的格式，方便检索
          members.forEach(member => result[member.bid] = member);
          resolve(result);
        });
    });
  }
}
