import * as mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, unique: true, trim: true },
  price: Number,
  discountPrice: Number,
  isDelete: Boolean,
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
