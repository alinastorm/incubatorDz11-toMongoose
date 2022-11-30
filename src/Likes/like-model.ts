import mongoose from "mongoose"
import { LikesBdModel, LikeStatus } from "./like-types"

const likeBdSchema = new mongoose.Schema<LikesBdModel>({
    id: String,
    commentId: String,
    userId: String,
    myStatus: {
        type: String,
        enum: LikeStatus
    }  
}, { versionKey: false })

export const likesModel = mongoose.model("likes", likeBdSchema)