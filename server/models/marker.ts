import * as mongoose from 'mongoose';

const markerSchema = new mongoose.Schema({
  bid: { type: String, unique: true, trim: true },
  username: { type: String, unique: true, trim: true },
  name: String,
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
}, { timestamps: true });

const Marker = mongoose.model('Marker', markerSchema);

export default Marker;
