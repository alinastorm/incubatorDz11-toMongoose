import mongoose, { Model } from 'mongoose';
import { RepositoryMongoose } from '../_common/abstractions/Repository/Repository-mongoose';
import { CommentBdModel, commentBdSchema } from './comments-types';



class CommentsRepository extends RepositoryMongoose<CommentBdModel> {
    constructor(model: Model<CommentBdModel>) { super(model) }
}

export default new CommentsRepository(mongoose.model("comments", commentBdSchema))






