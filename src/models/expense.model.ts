import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IExpense extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
};

export interface IExpenseModel extends Model<IExpense> { };

const expenseSchema = new Schema<IExpense, IExpenseModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"]
  },
  category: {
    type: String,
    enum: ['Housing & Utilities', 'Transportation', 'Food & Dining', 'Healthcare', 'Subscriptions & Bills', 'Personal & Lifestyle', 'Financial', 'Education', 'Necessities', 'Miscellaneous'],
    required: [true, "Category is required"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, "Description cannot exceed 200 characters"]
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
  UpdatedAt: {
    type: Date,
    default: Date.now
  }
});