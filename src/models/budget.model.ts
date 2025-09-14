import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBudget extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  calculateSpent(startDate?: Date, endDate?: Date): Promise<number>;
  isOverspent(startDate?: Date, endDate?: Date): Promise<boolean>;
  remainingBudget(): Promise<number>;
  getUsagePercentage(): Promise<number>;
}

const budgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
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

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget;