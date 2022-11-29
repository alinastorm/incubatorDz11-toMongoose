import { Request } from 'express';

import commentsRepository from './comments-repository';
import likesRepository from '../Likes/like-repository';
import { CommentBdModel, CommentInputModel, CommentViewModel, LikesInfoViewModel } from './comments-types';
import { HTTP_STATUSES, RequestWithAccessTokenJWTBearer, RequestWithBody, RequestWithHeaders, RequestWithParams, RequestWithParamsBody, RequestWithParamsQuery, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http/types';
import { NoExtraProperties } from '../_common/types/types';
import { LikesBdModel, LikeStatus } from '../Likes/like-types';
import { Paginator, SearchPaginationModel } from '../_common/abstractions/Repository/types';
import { Filter } from 'mongodb';
import postsRepository from '../Posts/posts-repository';
import usersRepository from '../Users/users-repository';
import { UserViewModel } from '../Users/users-types';


// делаем контроллеры комментов в коментах

class CommentsController {

    async createOneByPostId(
        req: RequestWithParamsBody<{ postId: string }, CommentInputModel>
            & RequestWithBody<CommentInputModel>
            & RequestWithHeaders<{ authorization: string }>
            & { user: { userId: string } },
        res: ResponseWithBodyCode<CommentViewModel, 201 | 401 | 404>
    ) {
        const postId = req.params.postId
        const post = await postsRepository.readOne<CommentBdModel>(postId)
        if (!post) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

        const userId = req.user.userId
        const user = await usersRepository.readOne<UserViewModel>(userId)
        if (!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)

        const { login: userLogin } = user
        const createdAt = new Date().toISOString()
        const content = req.body.content

        const likesInfo: LikesInfoViewModel = { dislikesCount: 0, likesCount: 0, myStatus: LikeStatus.None }
        const element: Omit<CommentBdModel, 'id'> = { content, userId, userLogin, createdAt, postId, likesInfo }
        const idComment: string = await commentsRepository.createOne<CommentBdModel>(element)
        {
            const comment = await commentsRepository.readOne<CommentBdModel>(idComment)
            if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            const { postId, ...other } = comment
            const mapComment: NoExtraProperties<CommentViewModel, typeof other> = other
            res.status(201).send(mapComment)
        }
    }
    async readAll(req: Request, res: ResponseWithBodyCode<CommentBdModel[], 200>) {
        // TODO если есть access token сетим like Status
        const result = await commentsRepository.readAll<CommentBdModel>()
        res.send(result)
    }
    async readAllByPostIdPaginationSort(
        req: RequestWithParamsQuery<{ postId: string }, { pageNumber: number, pageSize: number, sortBy: keyof CommentBdModel, sortDirection: 1 | -1 }>
            & RequestWithAccessTokenJWTBearer,
        res: ResponseWithBodyCode<Paginator<CommentViewModel>, 200 | 404>
    ) {

        const { pageNumber, pageSize, sortBy, sortDirection } = req.query
        const postId = req.params.postId
        const filter: Filter<CommentBdModel> = { postId }
        const query: SearchPaginationModel<CommentBdModel> = { pageNumber, pageSize, sortBy, sortDirection, filter }
        {
            //если есть acccess token
            const userId = req.user?.userId
            const comments = await commentsRepository.readAllOrByPropPaginationSort<CommentBdModel>(query)
            const { items, ...other } = comments
            let mapComments: Paginator<CommentViewModel>
            // если есть access token сетим like status
            if (userId) {
                mapComments = {
                    items: await Promise.all(items.map(async (el) => {
                        const { postId, ...other } = el
                        const likes = await likesRepository.readAll<LikesBdModel>({ commentId: el.id, userId })
                        const like = likes[0]
                        const status = like ? like.myStatus : LikeStatus.None
                        other.likesInfo.myStatus = status

                        return other
                    })),
                    ...other,
                }
            }
            mapComments = {
                items: items.map((el) => {
                    const { postId, ...other } = el
                    return other
                }),
                ...other,
            }
            const result: NoExtraProperties<Paginator<CommentViewModel>, typeof mapComments> = mapComments
            return res.status(200).send(result)
        }
    }
    async readOne(
        req: RequestWithParams<{ commentId: string }>
            & RequestWithAccessTokenJWTBearer
        ,
        res: ResponseWithBodyCode<CommentViewModel, 200 | 404>
    ) {
        const commentId = req.params.commentId
        const comment = await commentsRepository.readOne<CommentBdModel>(commentId)
        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        const { postId, ...other } = comment//TODO повесить защиту типа
        const result = other
        //если есть acccess token
        const userId = req.user?.userId
        if (userId) {
            const likes = await likesRepository.readAll<LikesBdModel>({ commentId, userId })
            const like = likes[0]
            const status = like ? like.myStatus : LikeStatus.None
            result.likesInfo.myStatus = status
        }
        //Проверка выходного типа . совпадение typeof и присвоения переменной обязательно
        const body: NoExtraProperties<CommentViewModel, typeof result> = result
        res.status(HTTP_STATUSES.OK_200).send(body)
    }
    async updateOne(
        req: RequestWithParamsBody<{ commentId: string }, CommentInputModel>
            & RequestWithHeaders<{ authorization: string }>
            & { user: { userId: string } },
        res: ResponseWithCode<204 | 403 | 404>) {

        const { commentId } = req.params
        const content = req.body.content
        const userId = req.user.userId
        const comment = await commentsRepository.readOne<CommentBdModel>(commentId)
        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        if (comment.userId !== userId) return res.sendStatus(HTTP_STATUSES.NO_ACCESS_CONTENT_403)
        const isUpdated = await commentsRepository.updateOne(commentId, { content })
        isUpdated ?
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) :
            null
    }
    async deleteOne(
        req: RequestWithParams<{ commentId: string }>
            & RequestWithHeaders<{ authorization: string }>
            & { user: { userId: string } },
        res: ResponseWithCode<204 | 403 | 404>
    ) {
        const { commentId } = req.params
        const userId = req.user.userId
        const comment = await commentsRepository.readOne<CommentBdModel>(commentId)
        if (!comment) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        if (comment.userId !== userId) return res.sendStatus(HTTP_STATUSES.NO_ACCESS_CONTENT_403)
        const isDeleted = await commentsRepository.deleteOne(commentId)
        isDeleted ?
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : null
        // res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }

}
export default new CommentsController()