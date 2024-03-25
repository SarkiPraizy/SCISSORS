import { Schema, model, Document, Types } from 'mongoose';

interface UserUrl extends Document {
  origUrl: string;
  shortId: string;
  newUrl: string;
  user_id: Types.ObjectId;
  clicks: number;
  date: string;
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
});

const UserUrl = model<UserUrl>("userUrl", userUrlSchema);

export default UserUrl;
