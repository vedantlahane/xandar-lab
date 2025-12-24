import mongoose, { Schema, model, models } from 'mongoose';

const ProblemSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  platform: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String },
  topicName: { type: String, required: true },
});

const Problem = models.Problem || model('Problem', ProblemSchema);
export default Problem;
