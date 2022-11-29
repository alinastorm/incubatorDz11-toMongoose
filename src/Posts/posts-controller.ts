import { Request } from 'express';

import { Filter } from 'mongodb';
import blogsRepository from '../Blogs/blogs-repository';
import { BlogViewModel } from '../Blogs/blogs-types';
import commentsRepository from '../Comments/comments-repository';
import { CommentBdModel, CommentInputModel, CommentViewModel } from '../Comments/comments-types';
import { UserViewModel } from '../Users/users-types';
import usersRepository from '../Users/users-repository';
import { Paginator, SearchPaginationModel } from '../_common/abstractions/Repository/types';
import { HTTP_STATUSES, RequestWithBody, RequestWithHeaders, RequestWithParams, RequestWithParamsBody, RequestWithParamsQuery, RequestWithQuery, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http/types';
import { NoExtraProperties } from '../_common/types/types';
import postsRepository from './posts-repository';
import { PostInputModel, PostViewModel } from './posts-types';


class PostsController {

    async readAll(req: Request, res: ResponseWithCode<200>) {
        const result = await postsRepository.readAll()
        res.status(HTTP_STATUSES.OK_200).send(JSON.stringify(result))
    }
    async readAllPaginationSort(
        req: RequestWithQuery<{ pageNumber: number, pageSize: number, sortBy: keyof PostViewModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<PostViewModel[]>, 200>
    ) {
        const { pageNumber, pageSize, sortBy, sortDirection } = req.query
        const query: SearchPaginationModel<PostViewModel> = { pageNumber, pageSize, sortBy, sortDirection }
        const posts: Paginator<PostViewModel[]> = await postsRepository.readAllOrByPropPaginationSort(query)

        res.status(HTTP_STATUSES.OK_200).json(posts)
    }
    async createOne(
        req: RequestWithBody<PostInputModel>,
        res: ResponseWithBodyCode<PostViewModel, 201 | 400>) {

        const { blogId, content, shortDescription, title } = req.body
        const blog = await blogsRepository.readOne<BlogViewModel>(blogId)
        if (!blog) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

        const { name: blogName } = blog
        const createdAt = new Date().toISOString()
        const element: Omit<PostViewModel, 'id'> = { blogId, blogName, content, createdAt, shortDescription, title }
        const id: string = await postsRepository.createOne(element)

        const post: PostViewModel | null = await postsRepository.readOne(id)
        if (!post) return res.status(HTTP_STATUSES.BAD_REQUEST_400)
        res.status(HTTP_STATUSES.CREATED_201).send(post)
    }
    async readOne(
        req: RequestWithParams<{ postId: string }>,
        res: ResponseWithBodyCode<PostViewModel, 200 | 404> &
            ResponseWithCode<404>
    ) {
        const id = req.params.postId
        const post = await postsRepository.readOne<PostViewModel>(id)
        if (!post) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404).send("post ")
        }
        res.status(HTTP_STATUSES.OK_200).send(post)
    }
    async updateOne(
        req: RequestWithParamsBody<{ postId: string }, PostInputModel>,
        res: ResponseWithCode<204 | 404>) {

        const id = req.params.postId
        const { blogId, content, shortDescription, title } = req.body

        const query: Partial<PostViewModel> = { blogId, content, shortDescription, title }
        const post = await postsRepository.readOne(id)
        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        await postsRepository.updateOne(id, query)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteOne(req: RequestWithParams<{ postId: string }>, res: ResponseWithCode<204 | 404>) {
        const postId = req.params.postId
        const post = await postsRepository.readOne<PostViewModel>(postId)
        if (!post) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        const isDeleted = await postsRepository.deleteOne(post.id)

        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteAll(req: Request, res: ResponseWithCode<204>) {
        await postsRepository.deleteAll()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async readAllPostsByBlogIdWithPaginationAndSort(
        req: RequestWithParamsQuery<{ blogId: string }, { pageNumber: number, pageSize: number, sortBy: keyof PostViewModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<PostViewModel[]>, 200 | 404>
    ) {
        const blogId = req.params.blogId
        const { pageNumber, pageSize, sortBy, sortDirection } = req.query
        const filter: Filter<PostViewModel> = { blogId }

        const query: SearchPaginationModel = { pageNumber, pageSize, sortBy, sortDirection, filter }
        const result: Paginator<PostViewModel[]> = await postsRepository.readAllOrByPropPaginationSort(query)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        res.status(HTTP_STATUSES.OK_200).send(result)
    }
    async createPostsByBlogId(
        req: RequestWithParamsBody<{ blogId: string }, PostInputModel>,
        res: ResponseWithBodyCode<PostViewModel, 201 | 404>
    ) {
        const blogId = req.params.blogId
        const { content, shortDescription, title } = req.body
        const blog = await blogsRepository.readOne<BlogViewModel>(blogId)
        if (!blog) return res.status(HTTP_STATUSES.NOT_FOUND_404)
        const { name: blogName } = blog
        const createdAt = new Date().toISOString()
        const query: Omit<PostViewModel, 'id'> = { blogId, blogName, content, createdAt, shortDescription, title }
        const id = await postsRepository.createOne(query)
        const post: PostViewModel | null = await postsRepository.readOne<PostViewModel>(id)
        if (!post) return res.status(HTTP_STATUSES.NOT_FOUND_404)
        res.status(HTTP_STATUSES.CREATED_201).send(post)
    }

}
export default new PostsController()
