import { AggregatePaginateModel, model, Model, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

import { CustomModel } from '../../types/shared/shared.types'
import { Lable } from '../../types/projects/lable.types'

const lableSchema = new Schema<CustomModel<Lable>>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    color: { type: String },
    name: { type: String },
    description: { type: String },
  },

  { timestamps: true }
)

lableSchema.plugin(mongooseAggregatePaginate)

export type LableModelType = Model<Lable> & AggregatePaginateModel<Lable>

const LableModel: Model<CustomModel<Lable>> = model<CustomModel<Lable>>(
  'Lable',
  lableSchema
)

export default LableModel
