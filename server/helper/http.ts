/**
 * Created by xiashan on 18/2/28.
 */

import axios from 'axios';
import { TEST_URL, BAIDU_COOKIE } from '../config/constant';


export default class HttpHelper {
  static getMarkList = (topicId: string, callback: any) => {
    const url = TEST_URL.replace('{topicID}', topicId);
    const instance = axios.create({
      timeout: 2000,
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8',
        'accept-charset' : 'utf-8',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
        'cookie': BAIDU_COOKIE.join('; '),
        'host': 'test.baidu.com',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
      },
    });
    instance.get(url)
      .then((response) => {
        callback(null, response.data.records);
      })
      .catch(error => callback(error));
  }

}
