import { ICampaign } from "./campaignType";
import { IScenario } from "./scenarioType";
import { IUser } from "./userType";

export interface IUserToScenarioAssignmentType {
  userId: IUser | string;
  scenarioId: string | IScenario;
  campaignId: string | ICampaign;
}
