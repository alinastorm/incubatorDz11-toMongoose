import mongoose, { Model } from 'mongoose';
import { RepositoryMongoose } from '../../_common/abstractions/Repository/Repository-mongoose';
import { RecoveryCodeBdModel, recoveryCodeSchema } from './recoveryPassword-types';







class RecoveryPasswordRepository extends RepositoryMongoose<RecoveryCodeBdModel> {
    constructor(model: Model<RecoveryCodeBdModel>) { super(model) }

}

export default new RecoveryPasswordRepository(mongoose.model("recoverycodes", recoveryCodeSchema))