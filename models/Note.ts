// models/Note.ts
import mongoose, { Schema, model, models, Document } from "mongoose";

export type NoteColor = 'default' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'orange';
export type NoteCategory = 'Learning' | 'Ideas' | 'Todo' | 'Reference' | 'Personal' | 'Work';
export type NoteVisibility = 'private' | 'public' | 'shared';
export type NoteStatus = 'draft' | 'published';

export interface IChangeRequest {
    _id?: string;
    requestedBy: string;
    requestedById: mongoose.Types.ObjectId;
    requestedByRole: string;
    message: string;
    status: 'pending' | 'resolved';
    createdAt: Date;
    resolvedAt?: Date;
}

export interface INote extends Document {
    authorId: mongoose.Types.ObjectId;
    authorUsername: string;
    authorRole?: string;
    title: string;
    content: string;
    category?: string;
    notebookId?: mongoose.Types.ObjectId;
    color: NoteColor;
    tags: string[];
    isPinned: boolean;
    visibility: NoteVisibility;
    sharedWith?: { userId: mongoose.Types.ObjectId; permission: 'viewer' | 'editor' }[];
    status: NoteStatus;
    isCurated?: boolean;
    changeRequests?: IChangeRequest[];
    upvotes: number;
    upvotedBy: string[];
    icon?: string;
    coverImage?: string;
    isDeleted: boolean;
    dueDate?: Date;
    revisions?: { content: string; updatedAt: Date }[];
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
        icon: {
            type: String,
            trim: true,
        },
        coverImage: {
            type: String,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        dueDate: {
            type: Date,
            index: true,
        },
        revisions: [
            {
                content: { type: String, required: true },
                updatedAt: { type: Date, default: Date.now },
            }
        ],
        category: {
            type: String,
            default: 'Learning',
            index: true,
        },
        notebookId: {
            type: Schema.Types.ObjectId,
            ref: 'Notebook',
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
            enum: ['private', 'public', 'shared'],
            default: 'private',
            index: true,
        },
        sharedWith: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                permission: { type: String, enum: ['viewer', 'editor'], default: 'viewer' }
            }
        ],
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
        isCurated: {
            type: Boolean,
            default: false,
            index: true,
        },
        changeRequests: [
            {
                requestedBy: { type: String, required: true },
                requestedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                requestedByRole: { type: String, default: 'admin' },
                message: { type: String, required: true },
                status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
                createdAt: { type: Date, default: Date.now },
                resolvedAt: { type: Date },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient user note listing & community note listing
NoteSchema.index({ authorId: 1, visibility: 1, createdAt: -1 });
NoteSchema.index({ visibility: 1, status: 1, createdAt: -1 });

export default models.Note || model<INote>("Note", NoteSchema);
