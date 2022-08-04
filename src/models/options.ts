import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
  },
  option: String,
  votes: {
    type: Number,
    default: 0,
  },
});

const Option = mongoose.model('Option', optionSchema);

export { Option }