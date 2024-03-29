import { Router } from "express";
import userModel from '../dao/models/users.model.js'

const router = Router();

router.post("/register", async (req,res)=>{
   const { first_name, last_name, email, age, password } = req.body;

   const exists = await userModel.findOne({email});

   if(exists){
    return res.status(400)
    .send({
        status:"error",
        error:"El usuario ya existe"
    })
   }
   const user = {
        first_name,
        last_name,
        email,
        age,
        password
    }

    let result = await userModel.create(user);
    return res.status(400)
    .send({
        status:"success",
        message:"Usuario registrado"
    })
})

router.post("/login", async (req,res)=>{
    const rol = 'user';
    const {email, password} = req.body;
    if (email.toLowerCase() === 'adminCoder@coder.com'.toLowerCase() && password === 'adminCoder3r123' ){
        req.session.user = {
            full_name: email,
            email: email,
            age: 0,
            rol: 'Admin'
        }
    }else {
        const user = await userModel.findOne({email,password});
    
        if(!user){
        return res.status(400).send({
                status:"error",
                error:"Datos incorrectos"
            })
        }
        req.session.user = {
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            rol
        }
    }

    
    res.send({
            status:"success",
            payload: req.session.user,
            message:"Mi primer Login!!"
        })
    })

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'No se pudo desloguear'
            })
        }
        res.redirect('/login')
    })
})

export default router;