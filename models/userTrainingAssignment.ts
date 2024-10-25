import { IUserTrainingAssignment } from "@/types/adminType";
import { Schema, Types, model, models } from "mongoose";

const userTrainingAssignmentSchema = new Schema<IUserTrainingAssignment>({
  userId: { type: Types.ObjectId, ref: "Admin", required: true },
  educationId: { type: String, required: true },

});

const UserTrainingAssignment =
  models.UserTrainingAssignment ||
  model<IUserTrainingAssignment>(
    "UserTrainingAssignment",
    userTrainingAssignmentSchema
  );

export default UserTrainingAssignment;
