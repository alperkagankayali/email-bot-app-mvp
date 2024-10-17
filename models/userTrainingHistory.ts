import { IUserTrainingHistory } from "@/types/userType";
import { Schema, Types, model, models } from "mongoose";

const userTrainingHistorySchema = new Schema<IUserTrainingHistory>({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  educationId: { type: String, required: true },
  status: {
    type: String,
    enum: ["not_completed", "in_progress", "completed"], // Allowed types
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

const UserTrainingHistory =
  models.UserTrainingHistory ||
  model<IUserTrainingHistory>("UserTrainingHistory", userTrainingHistorySchema);

export default UserTrainingHistory;
