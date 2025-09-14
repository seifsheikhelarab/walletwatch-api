import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { IExpense } from './expense.model.js';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  income: number;
  oauth?: 'google' | null;
  oauthId?: string;
  createdAt: Date;
  checkPassword: (candidatePassword: string) => Promise<boolean>;
  getExpenses: (startDate?: Date, endDate?: Date) => Promise<IExpense[]>;
  getBudgetStatus: () => Promise<{ totalExpenses: number; budgetStatus: string }>;
  getSavingGoalsStatus(): () => Promise<{ totalSavings: number; savingsStatus: string }>;
}

const userSchema = new Schema<IUser>({
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
  oauthId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre<IUser>('save', async function (next) {
  if (this.password === undefined) return next();
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, process.env.NODE_ENV === 'test' ? 1 : 10);
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


export const User = mongoose.model<IUser>('User', userSchema);

export default User;