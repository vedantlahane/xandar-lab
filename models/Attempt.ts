import mongoose, { Schema, model, models } from 'mongoose';

export interface IAttempt {
    _id: string;
    problemId: string;
    userId: string;
    content: string; // Used as approach now
    code?: string;
    language?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    feltDifficulty?: number; // 1-5 ranking
    duration?: number; // in seconds
    submissionCount?: number;
    status: 'attempting' | 'resolved' | 'solved_with_help' | 'gave_up';
    failureReason?: string;
    failureNote?: string;
    notes?: string;
    timestamp: Date;
    resolvedAt?: Date;
}

export interface IDiscussion {
    _id: string;
    attemptId: string;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
}

const DiscussionSchema = new Schema({
    attemptId: {
        type: Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const AttemptSchema = new Schema({
    problemId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000,
    },
    code: {
        type: String,
        maxlength: 20000,
    },
    language: {
        type: String,
        default: 'Python',
    },
    timeComplexity: {
        type: String,
        maxlength: 50,
    },
    spaceComplexity: {
        type: String,
        maxlength: 50,
    },
    feltDifficulty: {
        type: Number,
        min: 1,
        max: 5,
    },
    duration: {
        type: Number,
        default: 0,
    },
    submissionCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['attempting', 'resolved', 'solved_with_help', 'gave_up'],
        default: 'attempting',
    },
    failureReason: {
        type: String,
        maxlength: 100,
    },
    failureNote: {
        type: String,
        maxlength: 1000,
    },
    notes: {
        type: String,
        maxlength: 2000,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date,
    },
});

// Compound index for efficient queries
AttemptSchema.index({ userId: 1, timestamp: -1 });
AttemptSchema.index({ problemId: 1, userId: 1 });

const Attempt = models.Attempt || model('Attempt', AttemptSchema);
const Discussion = models.Discussion || model('Discussion', DiscussionSchema);

export { Discussion };
export default Attempt;