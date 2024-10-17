import { IUser } from "./userType"

export interface ICourse {
    title: string
    description: string
    author: IUser
    created_at: Date
    isPublished: boolean
    contents: string
  }
  