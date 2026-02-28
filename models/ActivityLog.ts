import mongoose, { Schema, model, models } from 'mongoose';

export interface IActivityLog {
    _id: string;
    userId: mongoose.Types.ObjectId;
    date: string;              // "YYYY-MM-DD" format
    problemsCompleted: string[];
    problemsAttempted: string[];
    totalDuration: number;     // seconds spent that day
    attemptsCount: number;
}

const ActivityLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: String,
        required: true,
        index: true,
    },
    problemsCompleted: [{ type: String }],
    problemsAttempted: [{ type: String }],
    totalDuration: { type: Number, default: 0 },
    attemptsCount: { type: Number, default: 0 },
});

ActivityLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const ActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
