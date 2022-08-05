import mongoose from 'mongoose';

interface pollDoc extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  topic: string;
  options: [mongoose.Types.ObjectId];
  voted: [mongoose.Types.ObjectId];
  inProgress: boolean;
  created_at: Date;
  updated_at: Date;
}

const pollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  topic: {
    type: String,
    required: true,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Option',
    },
  ],
  voted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vote',
    },
  ],
  inProgress: {
    type: Boolean,
    default: false,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
});

const Poll = mongoose.model<pollDoc>('Poll', pollSchema);

export { Poll };
