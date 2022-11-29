import registrationCodeRepository from '../Registration/registration-repository';
import { RegistrationCodeViewModel } from "../Registration/registration-types"
import mongoose, { Model } from 'mongoose';
import { RepositoryMongoose } from '../../_common/abstractions/Repository/Repository-mongoose';
import { AuthBDModel, authSchema } from './auth-types';

/** Hash Password */
class AuthRepository extends RepositoryMongoose<AuthBDModel> {
    constructor(model: Model<AuthBDModel>) { super(model) }

    async deleteOne(id: string) {
        // Удаляем auth        
        const isDeleted = await super.deleteOne(id)
        if (!isDeleted) return false
        // Удаляем registration codes
        const filter: Partial<RegistrationCodeViewModel> = { userId: id }
        const codes = await registrationCodeRepository.readAll(filter)
        codes.forEach((code) => {
            registrationCodeRepository.deleteOne(code.id)
        })
        return true
    }
}


export default new AuthRepository(mongoose.model("auth", authSchema))