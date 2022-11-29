import mongoose from "mongoose"

export interface BlogInputModel {
    name: string//    maxLength: 15
    description:string // maxLength: 500
    websiteUrl: string // maxLength: 100     pattern: ^ https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

}
// export interface BlogPostInputModel {
//     title: string//    maxLength: 30
//     shortDescription: string//    maxLength: 100
//     content: string//    maxLength: 1000
// }

export interface BlogViewModel {
    id: string
    name: string// max 15 TODO вроде уже нет ограничения
    description:string // maxLength: 500
    websiteUrl: string
    createdAt: string//TODO в дз не обязательный в интерфейсе
}
export interface BlogBdModel {
    id: string
    name: string// max 15 TODO вроде уже нет ограничения
    description:string // maxLength: 500
    websiteUrl: string
    createdAt: string//TODO в дз не обязательный в интерфейсе
}

export const blogBdSchema = new mongoose.Schema<BlogBdModel>({
    id: String,
    name: String,// max 15 TODO вроде уже нет ограничения
    description:String, // maxLength: 500
    websiteUrl: String,
    createdAt: String,//TODO в дз не обязательный в интерфейсе
})