import postsRepository from '../Posts/posts-repository';

import mongoose, { Model } from "mongoose"
import { RepositoryMongoose } from '../_common/abstractions/Repository/Repository-mongoose';
import { BlogBdModel, blogBdSchema } from './blogs-types';




class BlogsRepository extends RepositoryMongoose<BlogBdModel> {
    constructor(model: Model<BlogBdModel>) { super(model) }

    async deleteOne(id: string): Promise<boolean> {

        const isBlogDeleted = await super.deleteOne(id)
        if (!isBlogDeleted) return false

        const filter = { blogId: id }
        const posts = await postsRepository.readAll(filter)
        posts.forEach(async ({ id }) => {
            await postsRepository.deleteOne(id)
        })
        return true
    }
}

export default new BlogsRepository(mongoose.model("Blogs", blogBdSchema))