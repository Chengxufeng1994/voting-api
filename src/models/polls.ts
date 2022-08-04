import mongoose from 'mongoose';

interface IPoll {
  user: mongoose.Schema.Types.ObjectId;
  topic: string;
  options: [mongoose.Schema.Types.ObjectId];
  voted: [mongoose.Schema.Types.ObjectId];
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
      ref: 'User',
    },
  ],
  inProgress: {
    type: Boolean,
    default: false,
    required: true,
  },
  // open_from: {
  //   type: Date,
  //   required: true,
  // },
  // open_to: {
  //   type: Date,
  //   required: true,
  // },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
});

// pollSchema.pre('save', async () => {});

const Poll = mongoose.model('Poll', pollSchema);

export { Poll };
