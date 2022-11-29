import { registrationCodeSchema, RegistrationCodeViewModel } from './registration-types';
import { RepositoryMongoose } from '../../_common/abstractions/Repository/Repository-mongoose';
import mongoose, { Model } from 'mongoose';





/** Коды email регистрации */
class RegistrationCodesRepository extends RepositoryMongoose<RegistrationCodeViewModel> {
    constructor(model: Model<RegistrationCodeViewModel>) { super(model) }
}

export default new RegistrationCodesRepository(mongoose.model("registrationcodes", registrationCodeSchema))
