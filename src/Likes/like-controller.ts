import commentsRepository from "../Comments/comments-repository"
import { CommentBdModel, LikesInfoViewModel } from "../Comments/comments-types"
import { RequestWithAccessTokenJWTBearer, RequestWithBody, RequestWithParams, ResponseWithCode } from "../_common/services/http/types"
import likeRepository from "./like-repository"
import { LikeInputModel, LikesBdModel, LikeStatus } from "./like-types"





class likeController {

    async upsertOne(
        req: RequestWithBody<LikeInputModel>
            & RequestWithParams<{ commentId: string }>
            & RequestWithAccessTokenJWTBearer,
        res: ResponseWithCode<204 | 400 | 401 | 404>) {

        const myStatus = req.body.likeStatus
        const userId = req.user!.userId
        //проверка есть ли комменатрий по commentId
        const commentId = req.params.commentId
        const comment = await commentsRepository.readOne<CommentBdModel>(commentId)
        if (!comment) return res.sendStatus(404)
        //читаем like если не было лайков создаем дефолтный
        const likes = await likeRepository.readAll<LikesBdModel>({ commentId, userId })
        let userLike: LikesBdModel | undefined | null = likes[0]
        let likeId: string = userLike?.id
        if (!likeId) {
            const elementLike: Omit<LikesBdModel, "id"> = { commentId, myStatus: LikeStatus.None, userId }
            likeId = await likeRepository.createOne<LikesBdModel>(elementLike)
            userLike = await likeRepository.readOne<LikesBdModel>(likeId)
        }

        //обновление comments.likesInfo
        const newLikesInfo: LikesInfoViewModel = { ...comment.likesInfo }

        if (myStatus === LikeStatus.Like) {
            if (userLike?.myStatus === LikeStatus.Dislike) {
                newLikesInfo.likesCount++
                newLikesInfo.dislikesCount--
            } else if (userLike?.myStatus === LikeStatus.None) {
                newLikesInfo.likesCount++
            }
        }

        if (myStatus === LikeStatus.Dislike) {
            if (userLike?.myStatus === LikeStatus.Like) {
                newLikesInfo.dislikesCount++
                newLikesInfo.likesCount--
            } else if (userLike?.myStatus === LikeStatus.None) {
                newLikesInfo.dislikesCount++
            }
        }

        if (myStatus === LikeStatus.None) {

            if (userLike?.myStatus === LikeStatus.Dislike) {
                newLikesInfo.dislikesCount--
            }
            if (userLike?.myStatus === LikeStatus.Like) {
                newLikesInfo.likesCount--
            }
        }
        await commentsRepository.updateOne<CommentBdModel>(commentId, { likesInfo: newLikesInfo })
        //обновляем myLike
        const elementUpdate: Partial<LikesBdModel> = { myStatus }
        await likeRepository.updateOne<LikesBdModel>(likeId, elementUpdate)
        const sa = await likeRepository.readOne<LikesBdModel>(likeId)
        //отправка результата
        res.sendStatus(204)
    }

}

export default new likeController()
