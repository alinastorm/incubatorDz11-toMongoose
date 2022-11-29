import mongoose, { Model } from 'mongoose';
import { RottenToken, rottenTokenSchema } from './rottenTokens-types';
import { RepositoryMongoose } from '../../../_common/abstractions/Repository/Repository-mongoose';

/**Хранение невалидных токенов */
class RottenTokensRepository extends RepositoryMongoose<RottenToken> {
    constructor(model: Model<any>) { super(model) }
}


export default new RottenTokensRepository(mongoose.model("canceledTokens", rottenTokenSchema))