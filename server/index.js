const express = require('express');
const bodyParser = require('body-parser');
const Swagger = require('swagger-ui-express');
const swaggerFile = require('../swagger.json');
const app=express();
const BD = require('./BD');
const cors=require('cors')
const JWT=require('jsonwebtoken')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs",Swagger.serve,Swagger.setup(swaggerFile))

 const JWTSecrete="fhfruidfufhrefhfyrfgfrfyfdffaasedddewwda";


 function Auth(req,res,next){
    const authToken=req.headers['authorization'];
    
    if(authToken!=undefined){
    const Bearer=authToken.split(' ');
    JWT.verify(Bearer[1],JWTSecrete,(error,data)=>{
        if(error){
            res.status(500);
            res.json({error:'Token Invalid'})
        }else{
            req.token=Bearer[1]
            req.logger={id:data.id,email:data.email};
            next();
        }
    })

    }else{
        res.status(401);
        res.json({error:'Token Invalid'});
    }
    
   
 }
app.get('/games',Auth,(req,res)=>{

    let HATEOAS=[
        {
            href:"http://localhost:8080/auth",
            method:"POST",
            rel:"Login"
         
        },
        {
            href:"http://localhost:8080/game",
            method:"POST",
            rel:"Create a Game"

        },
        {
            href:"http://localhost:8080/game/id",
            method:"GET",
            rel:"Get a game"
        }
    ]
    res.status(200);
    res.json({games:BD.games,_links:HATEOAS}); 
});

app.get('/game/:id',Auth,(req,res)=>{
    const id=req.params.id;
    
    if(isNaN(id)){
        res.status(400);
        res.send("Argumeto passado não é um número");
    }else{
        const game = BD.games.find(g=>g.id==id);
      if(game==undefined){
        res.status(404);
        res.json({message:'Game not exist'});
      }
        res.json(game);
    }
});

app.post('/game',Auth,(req,res)=>{
    const {title,year,price}=req.body;
   
    if(title==undefined || year==undefined || price==undefined){
        res.status(400);
        res.json({message:'Os dados passados não estão corretos'})
    }else{

        let id=BD.games[BD.games.length-1].id;
        id++;
    
        BD.games.push({
            id:id,
            title:title,
            year:year,
            price:price
        });
        res.status(201).send('created');
    }
   
})

app.delete('/game/:id',Auth,(req,res)=>{
    const id=req.params.id;
    if(isNaN(id)){
        res.status(404).send('Invalid id');
    }else{
        let game=BD.games.findIndex(g=>g.id==id);
        if(game==-1){
            res.status(404).send('Game not found');
        }else{
            BD.games.splice(game, 1);
            res.status(200).send('deleted');
        }
    }
})

app.put('/game/:id',Auth,(req,res)=>{
    const id=req.params.id;
    const {title,year,price}=req.body;

    if(isNaN(id)){
        res.status(400);
        res.send("Argumeto passado não é um número");
    }else{
        const game = BD.games.find(g=>g.id==id);
      if(game==undefined){
        res.status(404);
        res.json({message:'Game not exist'});
      }else{
       if(title!=undefined){
        game.title=title
       }
       if(year!=undefined){
        game.year=year
       }
       if(price!=undefined){
        game.price=price
       }

       res.status(200).json({message:'Game update'});
      }
        
    }
});

app.post('/auth',(req,res)=>{ 
    
    if(email!=undefined){
       let user= BD.users.find(user=>user.email==email);
       
       if(user!=undefined){

        if(user.Password==Password){
          
            res.status(200);
            JWT.sign({email:user.email,id:user.id},JWTSecrete,{expiresIn:"48h"},(err,token)=>{
                if(err){
            
                    res.status(500);
                    res.json({error:`Erro ao gerar token ${err}`});
                }else{
                  
                    res.status(200);
                    res.json({token:token});
                }
            })
           
        }else{
            res.status(401);
            res.json({message:"Password invalid"})
        }
       }else{
            res.status(404);
            res.json({message:"Usuario não existente"});
       }
    }else{
        res.status(400);
        res.json({message:"Email Invalid"})
    }
})

app.listen(8080,()=>{
    console.log('API rodando...');
});