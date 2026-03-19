

export const corsOption = ()=>{
    const whiteList = process.env.WHITELIST?.split(",")||[]

    const corsOptions = {
        origin:(origin,cb)=>{
            if(!origin){
                return cb(null,true)
            }
            if(whiteList.includes(origin)){
                return cb(null,true)
            }
            else{
                return  cb(new Error("not allowd by cors"))
            }
        }
    }
    return corsOptions
}


// export function corsOption() {
//     const whitelist= process.env.WHITELIST?.split(",") || []

//     const corsOptions = {
//         origin:function(origin,callback) {
//             if(!origin){
//                 return callback(null,true)
//             }
//             if (whitelist.includes(origin)) {
//                 return callback(null,true)
//             }else{
//                 callback(new Error("not allowed by cors"))
//             }
//         },
//         methods:["POST","GET","DELETE","PATCH"]
//     }
//     return corsOptions
// }