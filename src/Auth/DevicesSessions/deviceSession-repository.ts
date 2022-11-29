import mongoose, { Model } from "mongoose";
import { RepositoryMongoose } from "../../_common/abstractions/Repository/Repository-mongoose";
import { DeviceBdModel, deviceSessionsSchema } from "./deviceSession-types";




class DeviceSessionsRepository extends RepositoryMongoose<DeviceBdModel> {
    constructor(model: Model<DeviceBdModel>) { super(model) }
}

export default new DeviceSessionsRepository(mongoose.model("deviceSessions", deviceSessionsSchema))
