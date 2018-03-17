import * as mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  userId: String,
  username: String,
  name: String,
  donePageCount: Number,
  areaCount: Number,
});

const topicSchema = new mongoose.Schema({
  no: { type: Number, unique: true },
  name: { type: String, unique: true, trim: true },
  shortName: String,
  total: Number,
  assessment: Number,
  passTime: { type: Date },
  note: String,
  withhold: { type: Boolean, 'default': false }, // 是否有扣款
  settle: { type: Boolean, 'default': false }, // 是否结算
  marks: [markSchema],
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
