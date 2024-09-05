import express from 'express'
import userRouter from './user'
import accountRouter from './account'


const router = express.Router()
router.use('/user', userRouter)
router.use('/account', accountRouter)

router.get('/', (req,res)=>{
    res.send('hi from router')
})

export default router