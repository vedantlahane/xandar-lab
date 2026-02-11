import mongoose, { Schema, Document } from 'mongoose';

// ── Rich context sub-schema ────────────────────────────────────────────────
// Stores the full page context scraped by the Clipper extension.
// This raw data will be parsed by Gemini (or another LLM) in a future step
// to extract structured job fields (company, role, salary, etc.).

export interface IPageContext {
    /** document.title */
    pageTitle: string;
    /** OpenGraph, description, and other meta tags */
    metaTags: Record<string, string>;
    /** JSON-LD structured data blocks from the page */
    jsonLd: Record<string, unknown>[];
    /** Trimmed HTML of the main content area */
    mainHtml: string;
    /** Full plaintext of the page */
    plainText: string;
}

export interface IClippedJob extends Document {
    /** Rich context scraped from the page */
    context: IPageContext;
    /** URL the job was captured from */
    sourceUrl: string;
    /** "capture" = manual popup save, "apply" = auto-detected application click */
    action: 'capture' | 'apply';
    /** ISO timestamp from the extension */
    capturedAt: Date;
    /** Username of the user who captured the job (optional – extension may not be authed) */
    username?: string;
    /** Server-side creation timestamp */
    createdAt: Date;
}

const PageContextSchema = new Schema<IPageContext>({
    pageTitle: { type: String, default: '' },
    metaTags: { type: Schema.Types.Mixed, default: {} },
    jsonLd: { type: [Schema.Types.Mixed], default: [] } as any,
    mainHtml: { type: String, default: '' },
    plainText: { type: String, default: '' },
}, { _id: false }); // No separate _id for sub-document

const ClippedJobSchema = new Schema<IClippedJob>({
    context: {
        type: PageContextSchema,
        required: true,
    },
    sourceUrl: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ['capture', 'apply'],
        default: 'capture',
    },
    capturedAt: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        index: true,
        sparse: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for efficient queries by source URL (deduplication)
ClippedJobSchema.index({ sourceUrl: 1, username: 1 });

export default mongoose.models.ClippedJob ||
    mongoose.model<IClippedJob>('ClippedJob', ClippedJobSchema);
