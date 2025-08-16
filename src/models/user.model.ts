import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  income: number;
  oauth?: 'google' | null;
  createdAt: Date;
  checkPassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUser> { };

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function (this: IUser) { return !this.oauth },
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  income: {
    type: Number,
    required: [true, "Income is required"],
    default: 0
  },
  oauth: {
    type: String,
    enum: ['google', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.checkPassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;