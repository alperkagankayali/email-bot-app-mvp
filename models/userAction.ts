import { IUserAction } from "@/types/adminType";
import { Schema, Types, model, models } from "mongoose";

const userActionSchema = new Schema<IUserAction>({
  userId: { type: Types.ObjectId, ref:"Admin", required: true },
  campaingId: { type: Types.ObjectId, ref:"Campaign", required: true },
  action: {
    type: String,
    enum: ["not_opened", "opened", "clicked", "data_entered"],
    required: true,
  },
  actionDate: { type: Date, default: Date.now },
});

const UserAction =
  models.UserAction || model<IUserAction>("UserAction", userActionSchema);

export default UserAction;
