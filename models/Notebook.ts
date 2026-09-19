import mongoose, { Schema, Document } from "mongoose";

export interface INotebook extends Document {
    name: string;
    authorId: mongoose.Types.ObjectId;
    parentId?: mongoose.Types.ObjectId;
    icon?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotebookSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        parentId: { type: Schema.Types.ObjectId, ref: "Notebook" },
        icon: { type: String },
        color: { type: String, default: "default" },
    },
    { timestamps: true }
);

// Indexes
NotebookSchema.index({ authorId: 1 });
NotebookSchema.index({ parentId: 1 });

export default mongoose.models.Notebook || mongoose.model<INotebook>("Notebook", NotebookSchema);
