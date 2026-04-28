import { ObjectId } from 'mongoose'

export interface Team {
  _id?: ObjectId
  name: string
  members: ObjectId[]
  projectId: ObjectId
  leader?: ObjectId
}

export interface GetTeamsQuery {
  page: number
  limit: number
  teamId: string
  projectId: string
  name: string
}

export interface AddOrRemoveTeamLeaderBody {
  projectId: string
  teamId: string
  memberId: string
  isRemove: boolean
}
