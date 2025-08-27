import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IGoal extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  targetAmount: number;
  deadline: Date;
  status: 'active' | 'achieved' | 'failed';
  createdAt: Date;
  isExpired(): boolean;
}

export interface IGoalModel extends Model<IGoal> { };

const goalSchema = new Schema<IGoal, IGoalModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
  },
  title: {
    type: String,
    required: [true, "title is required"]
  },
  targetAmount: {
    type: Number,
    required: [true, "Target Amount is required"],
    min: [0, "Target Amount can't be negative"]
  },
  deadline: {
    type: Date,
    required: [true, "Deadline is required"]
  },
  status: {
    type: String,
    enum: ['active', 'achieved', 'failed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

goalSchema.methods.isExpired = function (): boolean {
  return new Date() > this.deadline;
};

export const Goal = mongoose.model<IGoal, IGoalModel>('Goal', goalSchema);

export default Goal;