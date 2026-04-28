import { ObjectId } from 'mongoose'

import { SecretKeyModel } from '../../models'
import { SecretKey } from '../../types/app/secret-key.types'

class SecretKeyService {
  constructor(private secretKeyModel: typeof SecretKeyModel) {}

  async create(data: SecretKey) {
    return await this.secretKeyModel.create(data)
  }

  async update(userId: ObjectId, data: Partial<SecretKey>) {
    return await this.secretKeyModel.findOneAndUpdate({ userId }, data, {
      new: true,
    })
  }

  async delete(userId: ObjectId) {
    return await this.secretKeyModel.deleteOne({ userId })
  }

  async get(userId: ObjectId) {
    return await this.secretKeyModel.findOne({ userId })
  }
}

export default SecretKeyService
