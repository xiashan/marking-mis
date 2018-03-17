/**
 * Created by xiashan on 18/3/14.
 */
import Agent from '../models/agent';

export default class AgentService {
  model = Agent;

  getList = () => {
    return new Promise((resolve, reject) => {
      this.model
        .find()
        .exec((err, agents) => {
          if (err) {
            return reject(err);
          }
          const result = {};
          // 转换成以bid为key的格式，方便检索
          agents.forEach(agent => result[agent._id] = agent);
          resolve(result);
        });
    });
  }
}
