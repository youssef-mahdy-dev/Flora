

import multer from "multer"
import fs from "node:fs"
import path from "node:path"

export const fileValidation ={
        images:["image/png","image/jpeg","image/jpg"],
    videos:["video/mp4","video/mj2","video/mpeg"],
    audios:["audio/webm","audio/x-pn-realaudio-plugin"],
    documents:["application/pdf","application/msword"],
}

export const localFileUpload = ({
    customPath = "general",
    validation = []
})=>{
    const basePath =   `uploads/${customPath}`
    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            let userPath = basePath
            if(req.user?._id) userPath += `/${req.user?._id}`
            const fullPath = path.resolve(`./src/${userPath}`)
            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath,{recursive:true})

                cb(null,fullPath)
        },
        filename:(req,file,cb)=>{
            const uniqueSuffix = Date.now()+"-"+Math.round(Math.random()*1E9)+file.originalname
            file.finalPath = `${basePath}/${req.user?._id}/${uniqueSuffix}`
             cb(null,uniqueSuffix)
        }
    })

    const fileFilter = (req,file,cb)=>{
        if(!validation.includes(file.mimetype))
            return cb(new Error ("invalid file type",{cause:400}))
        return cb(null,true)
    }


    return multer({fileFilter,storage})
}