/**
 * Created by xiashan on 18/3/5.
 */
import * as mongoose from 'mongoose';

const memberFSchema = new mongoose.Schema({
  _member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  userId: String,
  username: String,
  name: String,
  income: Number,
  areaCount: Number,
  isBelong: Boolean,
});

const agentFSchema = new mongoose.Schema({
  _agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  name: String,
  income: Number,
  areaCount: Number,
});

const orderSchema = new mongoose.Schema({
  name: { type: String, unique: true, trim: true },
  income: Number,
  areaCount: Number,
  memberList: [memberFSchema],
  agentList: [agentFSchema],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
