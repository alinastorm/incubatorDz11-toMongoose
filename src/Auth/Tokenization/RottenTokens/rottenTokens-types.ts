import mongoose from "mongoose"

export interface RottenToken {
    id: string
    refreshToken: string
    expirationDate: Date
}
export const rottenTokenSchema = new mongoose.Schema<RottenToken>({
    id: String,
    refreshToken: String,
    expirationDate: Date
})