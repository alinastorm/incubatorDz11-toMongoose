import commentsRepository from '../Comments/comments-repository';
import { CommentBdModel } from '../Comments/comments-types';
import { RepositoryMongoose } from '../_common/abstractions/Repository/Repository-mongoose';
import mongoose, { Model } from 'mongoose';
import { PostBdModel, postBdSchema } from "./posts-types"



//написал тестовый DI    
class PostsRepository extends RepositoryMongoose<PostBdModel> {
    constructor(model: Model<PostBdModel>) { super(model) }


    async deleteOne(id: string): Promise<boolean> {
        const isPostDeleted = await super.deleteOne(id)
        if (!isPostDeleted) return false

        const filter: Partial<CommentBdModel> = { postId: id }
        const comments = await commentsRepository.readAll(filter)
        comments.forEach(async ({ id }) => {
            await commentsRepository.deleteOne(id)
        })
        return true
    }
}



export default new PostsRepository(mongoose.model("posts", postBdSchema))








