import mongoose from 'mongoose';

interface UserAttrs {
  identity: string;
  email: string;
  remark: string;
  created_at: Date;
  updated_at: Date;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  identity: string;
  email: string;
  remark: string;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new mongoose.Schema(
  {
    identity: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      required: false,
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.identity;
        delete ret.__v;
      },
    },
  }
);

// userSchema.pre('save', async function (done) {
//   done();
// });

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
