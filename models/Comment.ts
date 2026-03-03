import mongoose, { Schema, model, models } from 'mongoose';

export interface IComment {
    _id: string;
    postId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });

const Comment = models.Comment || model('Comment', CommentSchema);
export default Comment;
