import cryptoService from '../_common/services/crypto/crypto-service';
import usersRepository from './users-repository';
import { Filter, ObjectId } from 'mongodb';
import authRepository from '../Auth/Authentication/auth-repository';
import { UserBdModel, UserInputModel, UsersSearchPaginationModel, UserViewModel } from './users-types';
import { AuthViewModel } from '../Auth/Authentication/auth-types';
import { BlogViewModel } from '../Blogs/blogs-types';
import { HTTP_STATUSES, RequestWithBody, RequestWithParams, RequestWithQuery, ResponseWithBodyCode, ResponseWithCode } from '../_common/services/http/types';
import { Paginator, SearchPaginationModel } from '../_common/abstractions/Repository/types';


class UserController {

    async readAllPagination(
        req: RequestWithQuery<UsersSearchPaginationModel>,
        res: ResponseWithBodyCode<Paginator<UserViewModel>, 200>
    ) {

        const { pageNumber, pageSize, searchEmailTerm, searchLoginTerm, sortBy, sortDirection } = req.query

        const filter: Filter<UserViewModel> = { $or: [] }
        if (searchEmailTerm) filter.$or?.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
        if (searchLoginTerm) filter.$or?.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
        let query: SearchPaginationModel
        filter.$or?.length ?
            query = { pageNumber, pageSize, filter, sortBy, sortDirection } :
            query = { pageNumber, pageSize, sortBy, sortDirection }

        const users = await usersRepository.readAllOrByPropPaginationSort<UserBdModel>(query)
        const result: Paginator<UserViewModel> = users
        result.items = users.items.map(({ email, id, login, createdAt }): UserViewModel => {
            return { email, id, login, createdAt }
        })

        res.status(HTTP_STATUSES.OK_200).send(result)
    }
    async createOne(
        req: RequestWithBody<UserInputModel>,
        res: ResponseWithBodyCode<Omit<UserViewModel, "confirm">, 201 | 404>
    ) {

        const { email, login, password } = req.body
        const createdAt = new Date().toISOString()
        const element: Omit<UserBdModel, 'id'> = { email, login, createdAt, confirm: true }
        const userId: string = await usersRepository.createOne(element)

        const passwordHash = await cryptoService.generatePasswordHash(password)
        const queryAuth: Omit<AuthViewModel, "id"> = { passwordHash, userId, createdAt }
        const idAuth: string = await authRepository.createOne(queryAuth)

        const user: UserBdModel | null = await usersRepository.readOne(userId)

        if (!user) return res.status(HTTP_STATUSES.NOT_FOUND_404)
        const { confirm, ...other } = user
        const result = other
        res.status(HTTP_STATUSES.CREATED_201).send(result)
    }
    async deleteOne(
        req: RequestWithParams<{ id: string }>,
        res: ResponseWithCode<204> &
            ResponseWithCode<404>
    ) {
        const id = req.params.id
        if (!ObjectId.isValid(id)) return res.status(HTTP_STATUSES.NOT_FOUND_404).send(`id not valid id:${id}`)
        const result: boolean = await usersRepository.deleteOne(id)
        if (!result) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("user not found")
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

}
export default new UserController()