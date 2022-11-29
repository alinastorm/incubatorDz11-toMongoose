import mongoose, { Model } from 'mongoose';
import { RepositoryMongoose } from '../_common/abstractions/Repository/Repository-mongoose';
import { likeBdSchema, LikesBdModel } from './like-types';




class LikeRepository extends RepositoryMongoose<LikesBdModel> {
    constructor(model: Model<LikesBdModel>) { super(model) }
}

export default new LikeRepository(mongoose.model("likes", likeBdSchema))