import mongoose from "mongoose"

export interface RegistrationCodeViewModel {
    id: string
    userId: string
    email: string
    code: string
    expirationDate: Date
    // restartTime: Date
}
export interface RegistrationConfirmationCodeModel {
    /**Code that be sent via Email inside link */
    code: string
}

export interface RegistrationEmailResending {
    /**Email of already registered but not confirmed user */
    email: string //    pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$  
}

export const registrationCodeSchema = new mongoose.Schema<RegistrationCodeViewModel>({
    id: String,
    userId: String,
    email: String,
    code: String,
    expirationDate: Date
    // restartTime: Date
})