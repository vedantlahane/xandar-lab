import mongoose, { Schema, model, models } from "mongoose";

export interface ISignalCache {
  domain: string;
  signals: any[];
  createdAt: Date;
  expiresAt: Date;
}

const SignalCacheSchema = new Schema<ISignalCache>(
  {
    domain: { type: String, unique: true, required: true },
    signals: { type: [Schema.Types.Mixed] as any, default: [] },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, index: { expires: 0 } },
  },
  {
    collection: "signalCache",
  }
);

const SignalCache = models.SignalCache || model<ISignalCache>("SignalCache", SignalCacheSchema);
export default SignalCache;
