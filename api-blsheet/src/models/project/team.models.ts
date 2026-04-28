import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import { Team } from '../../types/projects/team.types'

const teamSchema = new Schema<CustomModel<Team>>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },

    name: {
      type: String,
      required: true,
    },

    members: {
      type: [Schema.Types.ObjectId],
      ref: 'Member',
      default: [],
    },

    leader: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: false,
    },
  },

  { timestamps: true }
)

teamSchema.plugin(mongooseAggregatePaginate)

export type TeamModelType = Model<Team> & AggregatePaginateModel<Team>

const TeamModel: Model<CustomModel<Team>> = model<CustomModel<Team>>(
  'Team',
  teamSchema
)

export default TeamModel
