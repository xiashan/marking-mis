import * as path from 'path';
import * as multer from 'multer';
import TopicService from '../services/topic';

export default class UploadCtrl {
  uploadFile = (req, res) => {
    const topicService = new TopicService();

    // 获取上传文件
    const uploading = multer({
      dest: path.join(__dirname, '../public/uploads'),
    }).single('file');

    uploading(req, res, (err) => {
      if (err) {
        return console.error(err);
      }

      const topicId = req.body._id;
      const uploadFile = req.file;

      // 保存数据
      const save = async () => {
        const markList = await topicService.parseMark(uploadFile.path);
        const db = await topicService.saveDB(topicId, markList);
        return {
          markList: markList,
          db: db,
        };
      };

      save().then((result) => {
        res.status(200).json(result.markList);
      }, error => {
        console.error(error);
      });
    });
  }
}
