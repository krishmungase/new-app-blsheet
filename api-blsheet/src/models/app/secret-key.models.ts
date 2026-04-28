import { Model, model, Schema } from 'mongoose'
import { CustomModel } from '../../types/shared/shared.types'
import { SecretKey } from '../../types/app/secret-key.types'

const secretKeySchema = new Schema<CustomModel<SecretKey>>(
  {
    secretKey: {
      type: String,
      require: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: true }
)

const SecretKeyModel: Model<CustomModel<SecretKey>> = model<
  CustomModel<SecretKey>
>('SecretKey', secretKeySchema, 'secret_keys')

export default SecretKeyModel
