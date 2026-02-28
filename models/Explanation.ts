import mongoose, { Schema, model, models } from 'mongoose';

export interface IExplanation {
    _id: string;
    problemId: string;
    userId: string;
    content: string;
    feedback?: {
        clarity: number;
        completeness: number;
        conciseness: number;
        good: string;
        missing: string;
    };
    timestamp: Date;
    updatedAt: Date;
}

const ExplanationSchema = new Schema({
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
    feedback: {
        clarity: Number,
        completeness: Number,
        conciseness: Number,
        good: String,
        missing: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

ExplanationSchema.index({ problemId: 1, userId: 1 }, { unique: true });

const Explanation = models.Explanation || model('Explanation', ExplanationSchema);

export default Explanation;
