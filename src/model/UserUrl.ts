import { Schema, model, Document, Types } from 'mongoose';

interface UserUrl extends Document {
  origUrl: string;
  shortId: string;
  newUrl: string;
  user_id: Types.ObjectId;
  clicks: number;
  date: string;
  // createResetToken: () => string;
  // password: string; // Add the 'password' property
  // passwordResetToken: string | undefined;
  // resetTimeExp: number | undefined;
}

const userUrlSchema = new Schema<UserUrl>({
  origUrl: { type: String, required: true },
  shortId: { type: String },
  newUrl: { type: String },
  user_id: {
    type: Schema.Types.ObjectId,
    // required: [true, "Please provide the blog author's Id."],
    ref: "userAuth",
  },
  clicks: { type: Number, required: true, default: 0 },
  date: { type: String, default: Date.now().toString() },
  // password: { type: String, required: true }, // Add the 'password' property to the schema
  // passwordResetToken: { type: String, default: undefined },
  // resetTimeExp: { type: Number, default: undefined },
});

const UserUrl = model<UserUrl>("userUrl", userUrlSchema);

export default UserUrl;
