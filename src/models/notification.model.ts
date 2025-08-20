import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: "overspending" | "reminder" | "report";
  message: string;
  sentAt: Date;
}

export interface INotificationModel extends Model<INotification> { };

const notificationSchema = new Schema<INotification, INotificationModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
  },
  type: {
    type: String,
    enum: ['overspending', 'reminder', 'report'],
    required: [true, "Notification type is required"]
  },
  message: {
    type: String,
    required: [true, "Message is required"]
  },
  sentAt: {
    type: Date,
    default: Date.now,
    required: [true, "Sent At date is required"]
  }
});

export const Notification = mongoose.model<INotification, INotificationModel>('Notification', notificationSchema);