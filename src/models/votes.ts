import mongoose from 'mongoose';

interface VoteAttrs {
  poll: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  option: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

interface VoteDoc extends mongoose.Document {
  poll: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  option: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

interface VoteModel extends mongoose.Model<VoteDoc> {
  build(attrs: VoteAttrs): VoteDoc;
}

const voteSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    requited: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    requited: true,
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    requited: true,
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

voteSchema.statics.build = (attrs: VoteAttrs) => {
  return new Vote(attrs);
};

const Vote = mongoose.model<VoteDoc, VoteModel>('Vote', voteSchema);

export { Vote };
