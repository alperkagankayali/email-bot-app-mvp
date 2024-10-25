import { IAdmin } from "./adminType"

export interface IScenario {
    title: string
    description: string
    scenarioType: 'data_entry'| 'clickable_link'
    emailUrl: string
    landingPageUrl: string
    dataEntryPageUrl: string
    author: IAdmin
    created_at: Date
  }
  