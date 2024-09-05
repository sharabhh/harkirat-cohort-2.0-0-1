import {Request, Response, NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from './config'

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

interface AuthenticatedRequest extends Request {
    userId?: string;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const authHeaders = req.headers.authorization


    if(!authHeaders || !authHeaders?.startsWith('Bearer ')){
        return res.status(401).json({msg: 'Not authorised'})
    }

    const token = authHeaders.split(' ')[1]

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload
        if(decoded.userId){
            req.userId = decoded.userId
            next()
        } else{
            return res.status(403).json()
        }

    } catch(e){
        res.status(401).json({msg: 'Some error occured'})
        
    }
    
    
}

export default authMiddleware