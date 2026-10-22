import {Request, Response, NextFunction} from 'express';

export type AuthRequestController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

const asyncWrapper = (controller: AuthRequestController) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }   
    };
};

export default asyncWrapper;