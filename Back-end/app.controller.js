

import {rateLimit} from "express-rate-limit"
import helmet from "helmet"
import  authRouter from "./src/modules/auth/auth.controller.js"
import  userRouter from "./src/modules/user/user.controller.js"
import  messageRouter from "./src/modules/message/message.controller.js"
import { connectDB } from "./src/DB/connection.js"
import { corsOption } from "./src/utils/cors/cors.utils.js"
import cors from "cors"
import { errorHandler } from "./src/utils/errorHandler.utils.js"
import dotenv from "dotenv"
import path from "node:path"
import morgan from "morgan"
import { attachRouterWithLogger } from "./src/utils/logger/logger.utils.js"
import plantRouter from "./src/modules/plant/plant.controller.js"
 const bootstrap = async(app,express)=>{
dotenv.config({path:"./src/config/.env.dev"})

// app.use('/xx',express.static(path.resolve('./src/uploads')))

app.use("/uploads",express.static(path.resolve("./src/uploads")))

    app.use(helmet())

    app.use(cors(corsOption()))

    
    const limiter = rateLimit({
        windowMs:5*60*1000,
        limit:100,
        message:{
            statusCode:429,
            message:"too many requests try again leter"
        },
        legacyHeaders:true
    })

    app.use(limiter)
    
    app.use(express.json())//parsing row body

    attachRouterWithLogger(app,'/api/v1/auth',authRouter,"auth.log")

    await connectDB()



    app.get("/",(req,res)=>{
        res.status(200).json({message:"hello from global handler"})
    })
   
 
    app.use('/api/v1/plant', plantRouter);
    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/user',userRouter)
    
    app.use('/api/v1/message',messageRouter)
    app.use(errorHandler)
     app.use("{/*dummy}",(req,res)=>{
        res.status(404).json({message:"not found handler"})
    })
}

export default bootstrap