import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBudget extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'monthly' | 'weekly';
  amount: number;
  startDate: Date;
  endDate: Date;
  spent: number;
  createdAt: Date;
  calculateSpent(startDate?: Date, endDate?: Date): Promise<number>;
  isOverspent(startDate?: Date, endDate?: Date): Promise<boolean>;
  remainingBudget(): Promise<number>;
  getUsagePercentage(): Promise<number>;
}

export interface IBudgetModel extends Model<IBudget> { };

const budgetSchema = new Schema<IBudget, IBudgetModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
  },
  type: {
    type: String,
    enum: ['monthly', 'weekly'],
    required: [true, "Budget type is required"]
  },
  amount: {
    type: Number,
    required: [true, "Budget amount is required"],
    min: [0, "Budget amount cannot be negative"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  spent: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 }, { unique: true });

budgetSchema.methods.calculateSpent = async function (startDate?: Date, endDate?: Date): Promise<number> {
  const expenses = await mongoose.model('Expense').find({
    userId: this.userId,
    createdAt: {
      $gte: startDate || this.startDate,
      $lte: endDate || this.endDate
    }
  });

  return expenses.reduce((total, expense) => total + expense.amount, 0);

};

budgetSchema.methods.isOverspent = async function (startDate?: Date, endDate?: Date): Promise<boolean> {
  const spent = await this.calculateSpent(startDate, endDate);
  return spent > this.amount;
};

budgetSchema.methods.remainingBudget = async function (): Promise<number> {
  const spent = await this.calculateSpent();
  return this.amount - spent;
};

budgetSchema.methods.getUsagePercentage = async function (): Promise<number> {
  const spent = await this.calculateSpent();
  return (spent / this.amount) * 100;
};

export const Budget = mongoose.model<IBudget, IBudgetModel>('User', budgetSchema);

export default Budget;