import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  password?: string;
  savedProblems: string[];
  completedProblems: string[];
  createdAt: Date;
  lastLoginAt?: Date;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true, // Allow null/undefined while maintaining uniqueness for actual values
  },
  bio: {
    type: String,
    maxlength: 200,
    default: '',
  },
  password: {
    type: String,
    required: false, // Optional for backward compatibility
  },
  savedProblems: [{
    type: String,
  }],
  completedProblems: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
  },
});

const User = models.User || model('User', UserSchema);
export default User;
