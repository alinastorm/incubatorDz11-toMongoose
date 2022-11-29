import { IObject } from '../../types/types';
import mongoose, { Document, FilterQuery, Model } from 'mongoose';
import { Paginator, SearchPaginationMongoDbModel } from './repository-mongodb-types';
import { ObjectId } from 'mongodb';
import { SearchPaginationMongooseModel } from './repository-mongoose-type';


export class RepositoryMongoose<T extends IObject> {

    constructor(private model: Model<T>) { }

    async readAll(filter?: Partial<T>, sortBy = "_id", sortDirection: 1 | -1 = 1): Promise<T[]> {
        if (filter) {
            return (await this.model
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .lean())
                .map((elem) => {
                    const { _id, ...other } = elem
                    return { id: _id.toString(), ...other } as unknown as T
                })
        }

        return (await this.model
            .find()
            .sort({ [sortBy]: sortDirection })
            .lean())
            .map((elem) => {
                const { _id, ...other
                } = elem
                return { id: _id.toString(), ...other } as unknown as T
            })
    }
    async readCount(filter?: Partial<T>) {
        if (filter) return await this.model.countDocuments(filter)
        return await this.model.countDocuments()
    }
    async readAllOrByPropPaginationSort(data: SearchPaginationMongooseModel<T>): Promise<Paginator<T>> {
        const { pageNumber, pageSize, sortBy, sortDirection, filter } = data
        const setPaginator = async (items: any) => {
            const count = await this.readCount(filter)
            const result: Paginator<any> = {
                "pagesCount": Math.ceil(count / pageSize),
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": count,
                items
            }
            return result
        }

        if (filter) {
            const items = (await this.model
                .find(filter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection })
                .lean())
                .map((elem) => {
                    const { _id, ...other } = elem
                    return { id: _id.toString(), ...other }
                })
            const result = setPaginator(items)

            return result
        }
        const items = (await this.model
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ [sortBy]: sortDirection })
            .lean())
            .map((elem) => {
                const { _id, ...other } = elem
                return { id: _id.toString(), ...other }
            })
        const result = setPaginator(items)

        return result
    }
    async readOne(id: string): Promise<T> {
        const result: any = await this.model.findOne({ _id: new ObjectId(id) })
        if (!result) return result
        const { _id, ...other } = result
        return { id: _id.toString(), ...other }
    }
    async createOne(element: Omit<T, "id">): Promise<string> {
        const result = (await this.model.create(element)).insertedId.toString()
        // if (result) return id
        return result
    }
    async updateOne(id: string, data: Partial<T>) {
        const result = await this.model.updateOne({ _id: new ObjectId(id) }, { $set: data })
        return result.modifiedCount === 1
    }
    async replaceOne(id: string, element: T) {
        const result = await this.model.replaceOne({ _id: new ObjectId(id) }, element)
        return result.modifiedCount === 1
    }
    async deleteOne(id: string) {
        const result = await this.model.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }
    async deleteAll() {
        const result = await this.model.deleteMany({})
        return result.acknowledged
    }
}


