import mongoose, { Document, Schema,} from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface Auth extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  passwordModifiedAt?: Date | number;
  active: boolean;
  passwordResetToken?: string;
  passwordResetTokenExpiryTime?: Date;
  isCorrectPassword(providedPassword: string): Promise<boolean>;
  passwordModified(JWT_IAT: number): boolean;
  genResetToken(): string;
}

const authSchema = new Schema<Auth>({
  firstName: {
    type: String,
    required: [true, 'Please provide your firstname.'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your lastname.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address.'],
  },
  password: {
    type: String,
    required: [
      true,
      "It's a dangerous world online! Please provide a password.",
    ],
    minLength: 6,
    select: false, // doesn't add this field on Read query
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password.'],
    minLength: 6,
    select: false,
  },
  
  passwordModifiedAt: { type: Date },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: { type: String },
  passwordResetTokenExpiryTime: Date,
});

// Pre document hook for hashing password before save
authSchema.pre<Auth>('save', async function (next) {
  if (!this.isModified('password')) return next(); // prevents hashing of unmodified password
  // Hashes the password of the currently processed document
  const hashedPassword = await bcrypt.hash(this.password, 12);
  // Overwrite plain text password with hash
  this.password = hashedPassword;
  // Clear the confirm password field
  this.confirmPassword = undefined;
  next();
});

// Pre document hook to update the passwordModifiedAt field after password change
authSchema.pre<Auth>('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next(); // prevents update of passwordModifiedAt field for unmodified password or new document
  this.passwordModifiedAt = Date.now() - 1500; // Setting it to 1.5s in the past to prevent token invalidation issues
  next();
});

// document method for checking correct password
authSchema.methods.isCorrectPassword = async function (
  providedPassword: string
) {
  return await bcrypt.compare(providedPassword, this.password);
};

// document method for checking if password has been modified after token was issued
authSchema.methods.passwordModified = function (JWT_IAT: number) {
  if (!this.passwordModifiedAt) return false;
  const JWT_IAT_TS = new Date(JWT_IAT * 1000).toISOString();
  return new Date(JWT_IAT_TS) < new Date(this.passwordModifiedAt);
};

// document method for generating reset Token
authSchema.methods.genResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpiryTime = Date.now() + 10 * 60 * 1000;
  return token;
};

const Auth = mongoose.model<Auth>('userAuth', authSchema);

export default Auth;
