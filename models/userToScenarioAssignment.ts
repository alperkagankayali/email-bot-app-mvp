import { IUserToScenarioAssignmentType } from "@/types/userToScenarioAssignmentType";
import { Schema, model, models } from "mongoose";

const userToScenarioAssignment = new Schema<IUserToScenarioAssignmentType>({
  userId: { type: Schema.Types.ObjectId, required: true },
  scenarioId: { type: Schema.Types.ObjectId, required: true },
  campaignId: { type: Schema.Types.ObjectId, required: true },
});

const UserToScenarioAssignment =
  models.UserToScenarioAssignment ||
  model<IUserToScenarioAssignmentType>(
    "UserToScenarioAssignment",
    userToScenarioAssignment
  );

export default UserToScenarioAssignment;
