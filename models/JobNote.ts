import mongoose, { Schema, Document } from 'mongoose';

export interface IJobNote extends Document {
    jobId: string;
    username: string;
    content: string;
    timestamp: Date;
}

const JobNoteSchema = new Schema<IJobNote>({
    jobId: {
        type: String,
        required: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for efficient queries
JobNoteSchema.index({ jobId: 1, username: 1 });

export default mongoose.models.JobNote || mongoose.model<IJobNote>('JobNote', JobNoteSchema);
