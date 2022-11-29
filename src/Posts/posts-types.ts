import mongoose from "mongoose"

export interface PostInputModel {
    title: string//    maxLength: 30
    shortDescription: string//    maxLength: 100
    content: string//maxLength: 1000
    blogId: string
}
export interface PostViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string//TODO в дз не обязательный в интерфей
}
export interface PostBdModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string//TODO в дз не обязательный в интерфей
}
export const postBdSchema = new mongoose.Schema<PostBdModel>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,//TODO в дз не обязательный в интерфей
}, { versionKey: false })

