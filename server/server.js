import express from 'express'
import fs from 'fs'
import https from 'https'
import cors from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(express.json())

const users =[]

app.get('/users', ( req, res ) => {

    res.json(users)
})

app.post('/users', async ( req, res ) => {
    if(users.find(user => user.name === req.body.name)) return res.send('User already registered')
    
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()

    } catch{
        res.status(500).send()
    }  
})

app.post('/users/login', async ( req, res ) => {
    const user = users.find(user => user.name === req.body.name)
    if( user == null) return res.status(400).send('Cannot find user')
        
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Allowed')
        } else {
            res.send('Not allowed')
        }       
        res.status(201).send()
    } catch{
        res.status(500).send()
    }  
})



//app.listen(3100)

https.createServer({
    cert:fs.readFileSync('server/SSL/code.crt'),
    key:fs.readFileSync('server/SSL/code.key')
}, app).listen(3101, () => {
    console.log("será que tá rodando???")
})