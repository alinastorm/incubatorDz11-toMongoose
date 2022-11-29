import mongoose from "mongoose"

export interface NewPasswordRecoveryInputModel {
    newPassword: string//    maxLength: 20    minLength: 6    New password    
    recoveryCode: string//    New password    
}
export interface PasswordRecoveryInputModel {
    /** Email of registered user */
    email: string//    pattern: ^ [\w -\.] +@([\w -] +\.) +[\w -]{ 2, 4 } $       
}
export interface RecoveryCodeBdModel {
    id: string
    recoveryCode: string
    email: string//    pattern: ^ [\w -\.] +@([\w -] +\.) +[\w -]{ 2, 4 } $       
}

export const recoveryCodeSchema = new mongoose.Schema<RecoveryCodeBdModel>({
    id: String,
    recoveryCode: String,
    email: String,//    pattern: ^ [\w -\.] +@([\w -] +\.) +[\w -]{ 2, 4 } $    
})

