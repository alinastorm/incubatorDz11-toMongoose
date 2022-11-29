import { Request } from 'express';
import { Filter } from 'mongodb';

import postsRepository from '../Posts/posts-repository';
import blogsRepository from './blogs-repository';
import { BlogBdModel, BlogInputModel, BlogViewModel } from './blogs-types';
import { PostInputModel, PostViewModel } from '../Posts/posts-types';
import { HTTP_STATUSES, RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithParamsQuery, RequestWithQuery, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http/types';
import { Paginator, SearchPaginationMongoDbModel } from '../_common/abstractions/Repository/repository-mongodb-types';
import { SearchPaginationMongooseModel } from '../_common/abstractions/Repository/repository-mongoose-type';
import { NoExtraProperties } from '../_common/types/types';



class BlogController {


    async readAllOrByNamePaginationSort(
        req: RequestWithQuery<{ searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: keyof BlogViewModel, sortDirection: 1 | -1 }>,
        res: ResponseWithBodyCode<Paginator<BlogViewModel>, 200>
    ) {
        const { searchNameTerm, pageNumber, pageSize, sortBy, sortDirection } = req.query
        const query: SearchPaginationMongooseModel = { pageNumber, pageSize, sortBy, sortDirection }
        if (searchNameTerm) query['filter'] = { name: { $regex: searchNameTerm, $options: 'i' } }
        const blogs: Paginator<BlogBdModel> = await blogsRepository.readAllOrByPropPaginationSort(query)
        const result: NoExtraProperties<Paginator<BlogViewModel>, typeof blogs> = blogs
        res.status(HTTP_STATUSES.OK_200).json(result)
    }
    async createOne(
        req: RequestWithBody<BlogInputModel>,
        res: ResponseWithBodyCode<BlogViewModel, 201 | 404>
    ) {

        const { name, websiteUrl, description } = req.body
        const createdAt = new Date().toISOString()
        const element: Omit<BlogViewModel, "id"> = { createdAt, name, websiteUrl, description }

        const id: string = await blogsRepository.createOne(element)
        const users: BlogViewModel | null = await blogsRepository.readOne(id)
        if (!users) return res.status(HTTP_STATUSES.NOT_FOUND_404)

        res.status(HTTP_STATUSES.CREATED_201).send(users)
    }
    async readOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithBodyCode<BlogViewModel, 200 | 404>
    ) {
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        res.status(HTTP_STATUSES.OK_200).send(result)
    }
    async updateOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithCode<204 | 404>
    ) {
        const body = req.body
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        await blogsRepository.updateOne(id, body)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async replaceOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithCode<204 | 404>
    ) {
        const body = req.body
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.status(HTTP_STATUSES.NOT_FOUND_404).send('Not Found')
        }
        await blogsRepository.replaceOne(id, body)
        return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
    async deleteOne(
        req: RequestWithParams<{ blogId: string }>,
        res: ResponseWithCode<204 | 404 | 500>
    ) {
        const id = req.params.blogId
        const result = await blogsRepository.readOne(id)
        if (!result) {
            return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
        if (await blogsRepository.deleteOne(id)) return res.sendStatus(204)
        return res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }
    async deleteAll(
        req: Request,
        res: ResponseWithCode<204>
    ) {
        await blogsRepository.deleteAll()
        res.status(HTTP_STATUSES.NO_CONTENT_204).send(JSON.stringify('All data is deleted'))
    }
}
export default new BlogController()