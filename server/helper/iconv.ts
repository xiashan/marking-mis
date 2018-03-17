/**
 * Created by xiashan on 18/3/13.
 */
import * as iconv from 'iconv-lite';

export default class IconvHelper {
  /**
   * 用于文件上传的转码
   * @param fileStr
   * @returns {string}
   */
  static iconv2utf8 = (fileStr) => {
    return iconv.decode(fileStr, 'gbk');
  }

  /**
   * 用于文件下载的转码
   * @param fileStr
   * @returns {NodeBuffer}
   */
  static iconv2gbk = (fileStr) => {
    return iconv.encode(fileStr, 'gbk');
  }
}
