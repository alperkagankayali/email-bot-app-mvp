import { IUser } from "./userType"

export interface IScenario {
    title: string
    description: string
    scenarioType: 'data_entry'| 'clickable_link'
    emailUrl: string
    landingPageUrl: string
    dataEntryPageUrl: string
    author: IUser
    created_at: Date
  }
  