import mongoose, { Schema, model, models } from 'mongoose';

export interface IPost {
    _id: string;
    authorId: mongoose.Types.ObjectId;
    content: string;

    // Polymorphic association to shared content
    sharedItemType?: 'InterviewSession' | 'Problem' | 'Note' | 'HackathonResult';
    sharedItemId?: mongoose.Types.ObjectId;

    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    content: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
    },
    // Allows sharing specific items on the feed
    sharedItemType: {
        type: String,
        enum: ['InterviewSession', 'Problem', 'Note', 'HackathonResult'],
    },
    sharedItemId: {
        type: Schema.Types.ObjectId,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

// Prevent sharing an item type without an item ID
PostSchema.pre('save', function () {
    if (this.sharedItemType && !this.sharedItemId) {
        throw new Error('sharedItemId is required when sharedItemType is specified.');
    }
});

const Post = models.Post || model('Post', PostSchema);
export default Post;
