const express = require('express');
const cookieSession = require('cookie-session');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8089;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
    cookieSession({
        name:'auth-session',
        keys:[process.env.COOKIE_SECRET],
        httpOnly:true
    })
)


app.get('/',(req,res)=>{
    res.send({message:"Bienvenido a mi API"})
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const db = require('./models');
const Role = db.role;
const Clothes = db.clothes;
db.mongoose.set('strictQuery', false);
db.mongoose.connect(process.env.MONGOURI,{}).then(()=>{
    console.log("Base de datos conectada");
    init()
}).catch((err)=>{
    console.error(err);
    process.exit();
})

function init(){
    Role.estimatedDocumentCount((err,count)=>{
        if(!err & count === 0){
            new Role({
                name: "user"
            }).save((err)=>{
                if(err){
                    console.log("Error al crear el rol usuario")
                }
                console.log("Rol usuario creado")
            });
            new Role({
                name: "moderator"
            }).save((err)=>{
                if(err){
                    console.log("Error al crear el rol moderator")
                }
                console.log("Rol moderator creado")
            });
            new Role({
                name: "admin"
            }).save((err)=>{
                if(err){
                    console.log("Error al crear el rol admin")
                }
                console.log("Rol admin creado")
            });
        }
    })
    Clothes.estimatedDocumentCount((err,count)=>{
        if(!err & count === 0){
            new Clothes({
                name: "Camisa",
                description: "Camisa de algodon",
                price: 20,
                category: "camisas",
                stock: 10,
                identity: 1
            }).save((err)=>{
                if(err){
                    console.log("Error al crear la ropa")
                }
                console.log("Ropa creada")
            });
            new Clothes({
                name: "Pantalon",
                description: "Pantalon de algodon",
                price: 30,
                category: "pantalones",
                stock: 10,
                identity: 2
            }).save((err)=>{
                if(err){
                    console.log("Error al crear la ropa")
                }
                console.log("Ropa creada")
            });
            new Clothes({
                name: "Zapatos",
                description: "Zapatos de cuero",
                price: 50,
                category: "zapatos",
                stock: 10,
                identity: 3
            }).save((err)=>{
                if(err){
                    console.log("Error al crear la ropa")
                }
                console.log("Ropa creada")
            });
            new Clothes({
                name: "Gorra",
                description: "Gorra de algodon",
                price: 10,
                category: "gorra",
                stock: 10,
                identity: 4
            }).save((err)=>{
                if(err){
                    console.log("Error al crear la ropa")
                }
                console.log("Ropa creada")
            });
            new Clothes({
                name: "Bufanda",
                description: "Bufanda de lana",
                price: 15,
                category: "bufanda",
                stock: 10,
                identity: 5
            }).save((err)=>{
                if(err){
                    console.log("Error al crear la ropa")
                }
                console.log("Ropa creada")
            });
        }
    })


}



app.listen(PORT, ()=>{
    console.log(`Escuchando el puerto ${PORT}`)
})