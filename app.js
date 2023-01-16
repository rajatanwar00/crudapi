const Joi= require('joi');
const express = require('express');
const app=express();
const jwt= require('jsonwebtoken');

app.use(express.json());

const genre= [
    {id:1,name: 'national'},
    {id:2,name: 'international'},
    {id:3,name: 'weather'},
]

app.get('/home',(req,res)=>{
    res.send('Welcome to blog, search "/home/news" for news');
})

app.get('/home/news',(req,res)=>{
    res.send('Welcome to news section, search for differnet news genre by id, existing genre by "/home/news/genre"');
    
})

app.get('/home/news/genre',(req,res)=>{
    res.send(genre);
})

app.get('/home/news/genre/:id',(req,res)=>{
    const type = genre.find(c => c.id === parseInt(req.params.id));
    if(!type) res.status(404).send('The genre with the given id was not found');
    res.send(type);
});

app.post('/home/news/genre/:id/write',verifytoken,(req,res)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            res.status(403);
        }else{
            const type = genre.find(c => c.id === parseInt(req.params.id));
            if(!type) res.status(404).send('The genre with the given id was not found');
           res.send(req.body.name);
           
        }
    });
    
});

app.post('/home/news/genre/:id/login',(req,res)=>{
    const user ={
        id:1,
        username:'user1',
        email:'user1@gmail.com'
    }
    jwt.sign({user},'secretkey',{expiresIn:'1h'},(err, token)=>{
        res.json({
            token
        });
    });
})

app.post('/home/news/genre',(req,res)=>{
    const type={
        id: genre.length +1,  
        name:req.body.name
    };
    genre.push(type);
    res.send(type);
})

app.delete('/home/news/genre/:id',(req,res)=>{
    const type = genre.find(c => c.id === parseInt(req.params.id));
    if(!type) res.status(404).send('The genre with the given id was not found');

    const index=genre.indexOf(type);
    type.splice(index,1);

    res.send(type);
})

function verifytoken(req,res,next){
    const bearerHeader= req.headers['authorization'];

    if(typeof bearerHeader !=='undefined'){
        const bearer=bearerHeader.split(' ');
        const bearerToken=bearer[1];
        req.token=bearerToken;
        next();
    }else{
        res.status(403);
    }
}

const port=process.env.PORT || 3000;
app.listen(port,()=>console.log(`Listening on port ${port}`));