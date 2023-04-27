import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {AWS_BUCKET_REGION, AWS_ACCESS_KEY_LOCAL, AWS_ACCESS_KEY_LOCAL_PWD, AWS_BUCKET_NAME} from './config.js'
import fs from 'fs'

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_LOCAL,
        secretAccessKey: AWS_ACCESS_KEY_LOCAL_PWD
    }
})

/*
 * upload a file to aws s3
 */
export async function uploadFile(file){
    
    let result = null
    // Stream de nodejs
    const stream = await fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    }

    const command = new PutObjectCommand(uploadParams)
    return result = await client.send(command)

}

/*
 * List files in the bucket 
 */
export async function getFiles(){
    // List files in the bucket 
    let result = null
    const command =  new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    })
    
    return result = await client.send(command)

}

/*
 * GetObjectCommand to download 1 file from the bucket
 */
export async function getFile(filename){
    
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })

    try{

        const result = await client.send(command)

        if (result.$metadata.httpStatusCode == 200){  
            // console.log(result.transformToByteArray())
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            const str = await result.Body.transformToString();
            return {result: result.$metadata.httpStatusCode, error: null, body: str }
        
        } else{
            
            throw ("Unknown error. Something happended.")
        
        }
        
    } catch(e){
      
        return {result: e.$metadata.httpStatusCode, error: `${e.Code}. Please provide a valid file name.`, body: null }
    }
    
}

export async function downloadFile(filename){
    
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })

    try{

        const result = await client.send(command)

        if (result.$metadata.httpStatusCode == 200){  
            // console.log(result.transformToByteArray())
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            // const str = await result.Body.transformToString();
            // return {result: result.$metadata.httpStatusCode, error: null, body: str }
            result.Body.pipe(fs.createWriteStream(`./images/${filename}`))
            return {result: result.$metadata.httpStatusCode, error: null, body: null }
        }
        
    } catch(e){
      
        return {result: e.$metadata.httpStatusCode, error: `${e.Code}. Please provide a valid file name.`, body: null }
    }
    
}

export async function getFileURL(filename){
    
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })

    try{

        const url = await getSignedUrl(client, command, { expiresIn: 36000 });

        if (url){  
            // console.log(result.transformToByteArray())
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            // const str = await result.Body.transformToString();
            // return {result: result.$metadata.httpStatusCode, error: null, body: str }
            
            return {result: url, error: null, body: null }
        }
        
    } catch(e){
      
        return {result: e, error: `${e}. Please provide a valid file name.`, body: null }
    }
    
}