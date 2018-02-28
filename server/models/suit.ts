import * as mongoose from 'mongoose';

const suitSchema = new mongoose.Schema({
  no: { type: Number, unique: true },
  name: { type: String, unique: true, trim: true },
  total: Number,
  assessment: Number,
  passTime: { type: Date },
  note: String,
  marks: Array
}, { timestamps: true });

const Suit = mongoose.model('Suit', suitSchema);

export default Suit;
