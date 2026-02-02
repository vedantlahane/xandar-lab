import mongoose, { Schema, model, models } from 'mongoose';

export interface ISession {
  tokenId: string;       // Unique identifier for the session
  userAgent?: string;    // Browser/device info
  ip?: string;           // IP address
  createdAt: Date;       // When the session was created
  lastActiveAt: Date;    // Last activity time
  expiresAt: Date;       // When the session expires
}

export interface IUser {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  avatarGradient?: string;  // Avatar color preference
  password?: string;
  savedProblems: string[];
  completedProblems: string[];
  savedJobs: string[];
  jobApplications: Map<string, string>;
  sessions: ISession[];   // Active sessions
  createdAt: Date;
  lastLoginAt?: Date;
}

const SessionSchema = new Schema<ISession>({
  tokenId: {
    type: String,
    required: true,
  },
  userAgent: String,
  ip: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

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
  avatarGradient: {
    type: String,
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
  savedJobs: [{
    type: String,
  }],
  jobApplications: {
    type: Map,
    of: String,
    default: new Map(),
  },
  sessions: {
    type: [SessionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
  },
});

// Clean up expired sessions before saving
UserSchema.pre('save', async function () {
  if (this.sessions && this.sessions.length > 0) {
    const now = new Date();
    // Use in-place mutation to avoid DocumentArray type mismatch
    for (let i = this.sessions.length - 1; i >= 0; i--) {
      if (this.sessions[i].expiresAt <= now) {
        this.sessions.splice(i, 1);
      }
    }
  }
});

const User = models.User || model('User', UserSchema);
export default User;
