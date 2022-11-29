import mongoose from "mongoose"
import { LikeStatus } from "../Likes/like-types"

export interface CommentInputModel {
    content: string //   maxLength: 300     minLength: 20
}
export interface CommentViewModel {
    id: string //nullable: true //TODO может быть nullable
    content: string
    userId: string
    userLogin: string
    createdAt?: string//($date-time) 	//TODO в дз не обязательный в интерфей
    likesInfo: LikesInfoViewModel
}
export interface CommentBdModel {

    id: string //nullable: true
    content: string
    userId: string
    userLogin: string
    postId: string
    createdAt?: string//($date-time)
    likesInfo: LikesInfoBdModel
}
export interface LikesInfoBdModel {
    /** Total likes for parent item */
    likesCount: number //	integer($int32)    
    /** Total dislikes for parent item */
    dislikesCount: number //	integer($int32)    
    /** Send None if you want to unlike\undislike */
    myStatus: LikeStatus //	h11.LikeStatusstring Enum:    Array[3]
}
export interface LikesInfoViewModel {
    /** Total likes for parent item */
    likesCount: number //	integer($int32)    
    /** Total dislikes for parent item */
    dislikesCount: number //	integer($int32)    
    /** Send None if you want to unlike\undislike */
    myStatus: LikeStatus //	h11.LikeStatusstring Enum:    Array[3]
}
export const likesInfoBdModel = new mongoose.Schema<LikesInfoBdModel>({
    /** Total likes for parent item */
    likesCount: Number, //	integer($int32)    
    /** Total dislikes for parent item */
    dislikesCount: Number, //	integer($int32)    
    /** Send None if you want to unlike\undislike */
    myStatus: LikeStatus //	h11.LikeStatusstring Enum:    Array[3]
})
export const commentBdSchema = new mongoose.Schema<CommentBdModel>({
    id: String, //nullable: true
    content: String,
    userId: String,
    userLogin: String,
    postId: String,
    createdAt: String,//($date-time)
    likesInfo: likesInfoBdModel
})
