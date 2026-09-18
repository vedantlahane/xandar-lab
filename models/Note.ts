// models/Note.ts
import mongoose, { Schema, model, models } from "mongoose";

export type NoteColor = 'default' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'orange';
export type NoteCategory = 'Learning' | 'Ideas' | 'Todo' | 'Reference' | 'Personal' | 'Work';
export type NoteVisibility = 'private' | 'public';
export type NoteStatus = 'draft' | 'published';

export interface INote {
    _id: string;
    authorId: mongoose.Types.ObjectId;
    authorUsername: string;
    authorRole?: string;
    title: string;
    content: string;
    category: NoteCategory;
    color: NoteColor;
    tags: string[];
    isPinned: boolean;
    visibility: NoteVisibility;
    status: NoteStatus;
    upvotes: number;
    upvotedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
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
        authorRole: {
            type: String,
            default: 'user',
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        content: {
            type: String,
            required: true,
            default: '',
        },
        category: {
            type: String,
            enum: ['Learning', 'Ideas', 'Todo', 'Reference', 'Personal', 'Work'],
            default: 'Learning',
            index: true,
        },
        color: {
            type: String,
            enum: ['default', 'yellow', 'green', 'blue', 'purple', 'pink', 'orange'],
            default: 'default',
        },
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        visibility: {
            type: String,
            enum: ['private', 'public'],
            default: 'private',
            index: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
            index: true,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        upvotedBy: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient user note listing & community note listing
NoteSchema.index({ authorId: 1, visibility: 1, createdAt: -1 });
NoteSchema.index({ visibility: 1, status: 1, createdAt: -1 });

export default models.Note || model<INote>("Note", NoteSchema);
