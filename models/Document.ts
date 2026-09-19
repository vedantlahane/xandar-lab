import mongoose, { Schema, model, models, Document as MongooseDocument } from "mongoose";

export type DocumentVisibility = 'private' | 'public' | 'shared';
export type DocumentStatus = 'draft' | 'published';

export interface IDocument extends MongooseDocument {
    authorId: mongoose.Types.ObjectId;
    authorUsername: string;
    authorRole?: string;
    title: string;
    content: string;
    parentId?: mongoose.Types.ObjectId;
    icon?: string;
    coverImage?: string;
    visibility: DocumentVisibility;
    sharedWith?: { userId: mongoose.Types.ObjectId; permission: 'viewer' | 'editor' }[];
    status: DocumentStatus;
    isCurated?: boolean;
    upvotes: number;
    upvotedBy: string[];
    isDeleted: boolean;
    revisions?: { content: string; updatedAt: Date }[];
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
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
        },
        authorRole: {
            type: String,
            default: 'user',
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            default: '',
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Document',
            default: null,
            index: true,
        },
        icon: {
            type: String,
        },
        coverImage: {
            type: String,
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
        isCurated: {
            type: Boolean,
            default: false,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        upvotedBy: {
            type: [String],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        revisions: [
            {
                content: { type: String, required: true },
                updatedAt: { type: Date, default: Date.now }
            }
        ],
    },
    {
        timestamps: true,
    }
);

DocumentSchema.index({ authorId: 1, visibility: 1, createdAt: -1 });

export default models.Document || model<IDocument>("Document", DocumentSchema);
