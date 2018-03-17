import * as mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  bid: { type: String, unique: true, trim: true },
  username: { type: String, unique: true, trim: true },
  name: String,
  _agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

export default Member;
