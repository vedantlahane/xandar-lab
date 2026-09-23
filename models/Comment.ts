import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IComment extends Document {
    noteId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    authorUsername: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        noteId: {
            type: Schema.Types.ObjectId,
            ref: 'Note',
            required: true,
            index: true,
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        authorUsername: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

CommentSchema.index({ noteId: 1, createdAt: 1 });

export default models.Comment || model<IComment>("Comment", CommentSchema);
