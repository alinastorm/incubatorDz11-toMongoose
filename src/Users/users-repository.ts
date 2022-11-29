import mongoose, { Model } from 'mongoose';
import authRepository from '../Auth/Authentication/auth-repository';
import { AuthViewModel } from '../Auth/Authentication/auth-types';
import { RepositoryMongoose } from '../_common/abstractions/Repository/Repository-mongoose';
import { IObject } from '../_common/types/types';
import { UserBdModel, userBdSchema } from './users-types';





class UsersRepository extends RepositoryMongoose<UserBdModel> {
    constructor(model: Model<UserBdModel>) { super(model) }


    async deleteOne(id: string) {
        // Удаляем users        
        const isDeleted = await super.deleteOne(id)
        if (!isDeleted) return false
        // Удаляем auth
        const filter: Partial<AuthViewModel> = { userId: id }
        const auths = await authRepository.readAll(filter)
        auths.forEach((auth) => {
            authRepository.deleteOne(auth.id)
        })
        return true
        // TODO возможно нужно удалять comments при удалении пользователя
    }
}



export default new UsersRepository(mongoose.model("users", userBdSchema))







