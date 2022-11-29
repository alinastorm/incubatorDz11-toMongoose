// import postsRepository from '../Posts/posts-repository';
// import { PostViewModel } from '../Posts/posts-types';
// import { RepositoryMongoDb } from '../_common/abstractions/Repository/Repository-mongodb';
// import mongoDbAdapter from '../_common/services/mongoDb/mongoDb-adapter';
// import { AdapterType } from '../_common/services/mongoDb/types';




// class BlogsRepository extends RepositoryMongoDb {
//     constructor(collectionName: string, dataService: AdapterType) { super(collectionName, dataService) }

//     async deleteOne(id: string): Promise<boolean> {

//         const isBlogDeleted = await super.deleteOne(id)
//         if (!isBlogDeleted) return false

//         const filter: Partial<PostViewModel> = { blogId: id }
//         const posts = await postsRepository.readAll(filter)
//         posts.forEach(async ({ id }) => {
//             await postsRepository.deleteOne(id)
//         })

//         return true

//     }
// }


// export default new BlogsRepository('blogs', mongoDbAdapter)







