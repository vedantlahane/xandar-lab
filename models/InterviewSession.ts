import mongoose, { Schema, model, models } from 'mongoose';

export interface IMessage {
    sender: 'ai' | 'user';
    text: string;
    timestamp: Date;
}

export interface IMetric {
    name: string;
    score: number;
}

export interface IReport {
    overallScore: number;
    metrics: IMetric[];
    strengths: string[];
    improvements: string[];
    suggestedProblemIds: string[];
}

export interface IInterviewSession {
    _id: string;
    userId: mongoose.Types.ObjectId;
    config: {
        style: string;
        difficulty: string;
        topic?: string;
        source?: 'sheet' | 'ai';
    };
    problemId?: string;
    messages: IMessage[];
    hintsUsed: number;
    phases: string[];
    duration?: number;
    status: 'active' | 'completed';
    report?: IReport;
    startedAt: Date;
    endedAt?: Date;
}

const MessageSchema = new Schema({
    sender: { type: String, enum: ['ai', 'user'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
}, { _id: false });

const MetricSchema = new Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true },
}, { _id: false });

const ReportSchema = new Schema({
    overallScore: { type: Number },
    metrics: [MetricSchema],
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    suggestedProblemIds: [{ type: String }],
}, { _id: false });

const InterviewSessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    config: {
        style: { type: String, required: true },
        difficulty: { type: String, required: true },
        topic: { type: String },
        source: { type: String, enum: ['sheet', 'ai'] },
    },
    problemId: { type: String },
    messages: [MessageSchema],
    hintsUsed: { type: Number, default: 0 },
    phases: [{ type: String }],
    duration: { type: Number },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    report: ReportSchema,
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
});

InterviewSessionSchema.index({ userId: 1, startedAt: -1 });

const InterviewSession = models.InterviewSession || model('InterviewSession', InterviewSessionSchema);

export default InterviewSession;
