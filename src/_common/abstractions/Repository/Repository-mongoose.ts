import { IObject } from '../../types/types';
import { Filter } from 'mongodb';
import mongoose from 'mongoose';
import bbbb from "../../../Blogs/blogs-repository"
// const dataService = new DataService(mongoDbAdapter)

const userSchema = new mongoose.Schema({
    userName: String,
    bio: String,
    createdAt: Date
})
const userModel = mongoose.model("Users", userSchema)
userModel.find(filter).



class MongooseRepository {


    async readAll(filter?: Filter<IObject>, sortBy = "_id", sortDirection: 1 | -1 = 1) {
        // userModel.find(filter)
        

    }


}

export default MongooseRepository

