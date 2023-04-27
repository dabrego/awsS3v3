import express from 'express'
import fileUpload from 'express-fileupload'
import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from './s3.js'


// import './config.js'


const app = express()
const port = 3105

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

app.use(express.static('images'))

app.get('/', (req, res)=>{
    res.json({"message": "Welcome"})
})

app.get('/list', async (req, res)=>{
    let result = await getFiles()
    res.json({result})
})

app.get('/fileurl/:filename', async (req, res)=>{
    const resultPromise = await new Promise( async (resolve, reject)=>{

        const result = await getFileURL(req.params.filename)

        if ( result ){
            resolve(result)
        }else {
            reject(result)
        }
    })
    .catch((e)=>{
       
        console.log(e)
        return e
    }) 
    
    if (resultPromise){
        res.send(resultPromise)
    }else {
        res.json({error: `${resultPromise.error}`})
    }
})

app.get('/download/:filename', async (req, res)=>{
    const resultPromise = await new Promise( async (resolve, reject)=>{

        const result = await downloadFile(req.params.filename)

        if ( typeof result == 200){
            resolve(result)
        }else {
            reject(result)
        }
    })
    .catch((e)=>{
       
        console.log(e)
        return e
    }) 
    
    if (resultPromise.result == 200){
        res.send('File donwloaded')
    }else {
        res.json({error: `${resultPromise.error}`})
    }
})

app.get('/file/:filename', async (req, res)=>{
    
    const resultPromise = await new Promise( async (resolve, reject)=>{

        const result = await getFile(req.params.filename)

        // console.log('typeof result: ', typeof result)
        if ( typeof result == 200){
            resolve(result)
        }else {
            reject(result)
        }
    })
    .catch((e)=>{
       
        console.log(e)
        return e
    }) 
    
    if (resultPromise.result == 200){
        res.send(resultPromise)
    }else {
        res.json({error: `${resultPromise.error}`})
    }
   
    
})

app.post('/files', async (req, res)=>{
   
    try{
        const result = await uploadFile(req.files.file)

        if( result.$metadata.httpStatusCode !=  200){
            res.json({ "result": null, error: "The file not loaded." })
        } else {
            res.json({ "result": result.ETag, error: null })
        }
    }catch(e){
        console.log(e)
        res.json({ result: null, error: "Bad request." })
    }
    
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })