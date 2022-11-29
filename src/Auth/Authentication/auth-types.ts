import mongoose from "mongoose"

export interface LoginInputModel {
    loginOrEmail: string
    password: string
}
export interface LoginSuccessViewModel {
    /** JWT access token */
    accessToken: string
}
export interface AuthInputModel {
    userId: string
    /**  maxLength: 20 minLength: 6 */
    passwordHash: string
}
export interface AuthViewModel {
    id: string
    userId: string
    /**  maxLength: 20 minLength: 6 */
    passwordHash: string
    createdAt: string
}
export interface AuthBDModel {
    id: string
    userId: string
    /**  maxLength: 20 minLength: 6 */
    passwordHash: string
    createdAt: string
}
export interface MeInputModel {
    /**Headers */
}
export interface MeViewModel {
    email: string
    login: string
    userId: string
}

export const authSchema = new mongoose.Schema<AuthBDModel>({
    id: String,
    userId: String,
    /**  maxLength: 20 minLength: 6 */
    passwordHash: String,
    createdAt: String,
}, { versionKey: false })