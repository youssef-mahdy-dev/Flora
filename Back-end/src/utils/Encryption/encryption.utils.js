import crypto, { createCipheriv } from 'node:crypto'

import fs from 'node:fs'

const encryption_key = Buffer.from(process.env.ENCRYPTION_SECRET_KEY)

const Iv_length = Number(process.env.IV_LENGTH)
 
const Iv = crypto.randomBytes(Iv_length)

export const encrypt = (plaintext)=>{

    // create

    const cipher = crypto.createCipheriv("aes-256-cbc",encryption_key,Iv)

    // update
    let encrypted = cipher.update(plaintext,"utf-8","hex")

    encrypted += cipher.final("hex")
    return Iv.toString("hex")+':'+ encrypted
}



export const decrypt = (decryptdata)=>{

    const [ivhex , cipherText] = decryptdata.split(":")
    const Iv = Buffer.from(ivhex,"hex")

    const decipher = crypto.createDecipheriv("aes-256-cbc",encryption_key,Iv)

       let decrypted = decipher.update(cipherText,"hex","utf-8")

    decrypted += decipher.final("utf-8")
    return  decrypted

}






// asymetric 





if (fs.existsSync("public_key.pem")&&fs.existsSync("private_key.pem")) {
    console.log('key already exists');
    
}else{

const {public_key , private_key} = crypto.generateKeyPairSync("rsa", {
    modulusLength : 2408,
    publicKeyEncoding:{
      type:"pkcs1",
      format:"pem"
    },
      privateKeyEncoding:{
      type:"pkcs1",
      format:"pem"
    }
})
fs.writeFileSync('public_key.pem',public_key)
fs.writeFileSync("private_key.pem",private_key)

}

 export const asymtricEncryption = (plainText)=>{
    const bufferedText = Buffer.from(plainText,"utf-8")

    const encryptedData = crypto.publicEncrypt({
        key:fs.readFileSync("public_key.pem","utf-8"),
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
    },bufferedText)


    return encryptedData.toString("hex")
 }


  export const asymtricdecryption = (cipherText)=>{
    const bufferedCipherText = Buffer.from(cipherText,"hex")

    const decryptedData = crypto.privateDecrypt({
        key:fs.readFileSync("private_key.pem","utf-8"),
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING
    },bufferedCipherText)

    return decryptedData.toString("utf-8")
 }