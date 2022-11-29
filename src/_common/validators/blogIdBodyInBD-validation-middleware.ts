import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../services/http/types';
import blogsRepository from '../../Blogs/blogs-repository';
import { ObjectId } from 'mongodb';






export const blogIdBodyInBDValidationMiddleware404 = async (req: any, res: Response, next: NextFunction) => {
    const id = req.body.blogId
    if (!ObjectId.isValid(id)) return res.status(HTTP_STATUSES.NOT_FOUND_404).send("blogId not valid")
    const blog = await blogsRepository.readOne(id)
    if (!blog) {
        return res.status(HTTP_STATUSES.NOT_FOUND_404).send('blog by blogId not found')
    }
    // req.body.blogName = blog.name
    next()
}