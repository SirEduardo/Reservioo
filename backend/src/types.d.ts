import { Request, Response, NextFunction } from "express"

export interface Controller {
    (req: Request, res: Response, next: NextFunction): void
}


