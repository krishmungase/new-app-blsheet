import mongoose, { PipelineStage } from 'mongoose'

import { LableModelType } from '../../models'
import { Lable } from '../../types/projects/lable.types'
import { getMongoosePaginationOptions } from '../../utils'

class LableService {
  constructor(private lableModel: LableModelType) {}

  async create(lable: Lable) {
    return await this.lableModel.create(lable)
  }

  async delete(lableId: string) {
    return await this.lableModel.deleteOne({
      _id: new mongoose.Types.ObjectId(lableId),
    })
  }

  async update(lableId: string, lable: Partial<Lable>) {
    return await this.lableModel.findByIdAndUpdate(lableId, lable, {
      new: true,
    })
  }

  async getLables(
    projectId: string,
    { page, limit, name }: { page: number; limit: number; name: string }
  ) {
    let searchQuery = new RegExp(name, 'i')

    const pipeline: PipelineStage[] = [
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          name: { $regex: searchQuery },
        },
      },
      { $sort: { createdAt: -1 } },
    ]
    const lables = await this.lableModel.aggregatePaginate(
      this.lableModel.aggregate(pipeline),
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          totalDocs: 'total',
          docs: 'lables',
        },
      })
    )

    return lables
  }
}

export default LableService
