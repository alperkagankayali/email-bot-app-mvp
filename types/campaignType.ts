import { IScenario } from "./scenarioType"
import { IUser } from "./userType"

export interface ICampaign {
    title: string
    description: string
    userList: IUser[]
    scenario: IScenario
    author: IUser
    created_at: Date
  }
  