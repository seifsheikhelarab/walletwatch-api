import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IExpense extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  getByCategory(userId: Types.ObjectId, category: string, startDate: Date, endDate: Date): Promise<IExpense[]>;
  getMonthlySummary(userId: Types.ObjectId, startDate: Date): Promise<Object[]>;
  getTotalSpent(userId: Types.ObjectId, startDate: Date, endDate: Date): Promise<number>;
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

expenseSchema.methods.getByCategory = async function (userId: Types.ObjectId, category: string, startDate: Date, endDate: Date): Promise<IExpense[]> {
  return this.model('Expense').find({
    userId,
    category,
    CreatedAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

expenseSchema.methods.getMonthlySummary = async function (userId: Types.ObjectId, startDate: Date): Promise<Object[]> {
  const expenses = await this.model('Expense').find({
    userId,
    CreatedAt: {
      $gte: startDate,
      $lte: new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    }
  });

  let summary: { category: string; amount: number }[] = [];
  for (const expense of expenses) {
    const category = expense.category;
    const amount = expense.amount;
    let existingCategory = summary.find((item) => item.category === category);
    if (existingCategory) {
      existingCategory.amount += amount;
    } else {
      summary.push({ category, amount });
    }
  }

  return summary;
}

expenseSchema.methods.getTotalSpent = async function (userId: Types.ObjectId, startDate: Date, endDate: Date): Promise<number> {
  const expenses = await this.model('Expense').find({
    userId,
    CreatedAt: {
      $gte: startDate,
      $lte: endDate
    }
  });

  return expenses.reduce((total: number, expense: IExpense) => total + expense.amount, 0);
}

export const Expense = mongoose.model<IExpense, IExpenseModel>('Expense', expenseSchema);

export default Expense;