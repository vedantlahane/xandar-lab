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

export type InterviewStyle = 'guided' | 'realistic' | 'pressure';

export const INTERVIEW_STYLES: Record<InterviewStyle, {
    label: string;
    description: string;
    hintBudget: number;
    silenceThreshold: number;
}> = {
    guided: {
        label: 'Guided',
        description: 'Patient, educational. Lots of hints. For learning.',
        hintBudget: 5,
        silenceThreshold: 120,
    },
    realistic: {
        label: 'Realistic',
        description: 'Like a real FAANG interview. Balanced help.',
        hintBudget: 3,
        silenceThreshold: 300,
    },
    pressure: {
        label: 'Pressure Test',
        description: 'Tough interviewer. Interruptions. Time pressure.',
        hintBudget: 1,
        silenceThreshold: 600,
    },
};

export interface IInterviewSession {
    _id: string;
    userId: mongoose.Types.ObjectId;
    config: {
        style: InterviewStyle;
        difficulty: number;        // 1-5
        hintBudget: number;
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
    // Community sharing
    visibility: 'private' | 'unlisted' | 'public';
    likes: number; // Cache for quick sorting
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
        style: { type: String, enum: ['guided', 'realistic', 'pressure'], required: true },
        difficulty: { type: Number, required: true, min: 1, max: 5 },
        hintBudget: { type: Number, default: 3 },
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
    visibility: {
        type: String,
        enum: ['private', 'unlisted', 'public'],
        default: 'private',
    },
    likes: { type: Number, default: 0 },
});

InterviewSessionSchema.index({ userId: 1, startedAt: -1 });

const InterviewSession = models.InterviewSession || model('InterviewSession', InterviewSessionSchema);

export default InterviewSession;
