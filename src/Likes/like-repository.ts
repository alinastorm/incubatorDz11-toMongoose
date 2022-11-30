import { Model } from 'mongoose';
import { RepositoryMongoose } from '../_common/abstractions/Repository/Repository-mongoose';
import { likesModel } from './like-model';
import { LikesBdModel } from './like-types';




class LikeRepository extends RepositoryMongoose<LikesBdModel> {
    constructor(model: Model<LikesBdModel>) { super(model) }
}

export default new LikeRepository(likesModel)