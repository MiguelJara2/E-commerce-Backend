const express = require('express');
const cookieSession = require('cookie-session');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8089;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: 'auth-session',
        keys: [process.env.COOKIE_SECRET],
        httpOnly: true
    })
)


app.get('/', (req, res) => {
    res.send({ message: "Bienvenido a mi API" })
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const db = require('./models');
const Role = db.role;
const Clothes = db.clothes;
const Coupons= db.coupon;
db.mongoose.set('strictQuery', false);
db.mongoose.connect(process.env.MONGOURI, {}).then(() => {
    console.log("Base de datos conectada");
    init()
}).catch((err) => {
    console.error(err);
    process.exit();
})

function init() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err & count === 0) {
            new Role({
                name: "user"
            }).save((err) => {
                if (err) {
                    console.log("Error al crear el rol usuario")
                }
                console.log("Rol usuario creado")
            });
            new Role({
                name: "moderator"
            }).save((err) => {
                if (err) {
                    console.log("Error al crear el rol moderator")
                }
                console.log("Rol moderator creado")
            });
            new Role({
                name: "admin"
            }).save((err) => {
                if (err) {
                    console.log("Error al crear el rol admin")
                }
                console.log("Rol admin creado")
            });
        }
    })
    Clothes.estimatedDocumentCount((err, count) => {
        if (!err & count === 0) {
            new Clothes({
                name: "Blazer",
                description: "Blazer negro de corte clásico y elegante",
                price: 80,
                category: "ropa clásica",
                stock: 15,
                identity: 1
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Pantalón",
                description: "Pantalón de vestir gris con pinzas",
                price: 60,
                category: "ropa clásica",
                stock: 20,
                identity: 2
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Camisa",
                description: "Camisa blanca formal de algodón",
                price: 45,
                category: "ropa clásica",
                stock: 25,
                identity: 3
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Falda",
                description: "Falda lápiz negra ajustada",
                price: 55,
                category: "ropa clásica",
                stock: 12,
                identity: 4
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Zapatos",
                description: "Zapatos de cuero marrón para oficina",
                price: 90,
                category: "ropa clásica",
                stock: 18,
                identity: 5
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });
            // Ropa urbana
            new Clothes({
                name: "Hoodie",
                description: "Sudadera oversized gris con capucha",
                price: 50,
                category: "ropa urbana",
                stock: 30,
                identity: 6
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Jogger",
                description: "Pantalón jogger negro con bolsillos laterales",
                price: 40,
                category: "ropa urbana",
                stock: 25,
                identity: 7
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Camiseta",
                description: "Camiseta oversize con estampado gráfico",
                price: 35,
                category: "ropa urbana",
                stock: 50,
                identity: 8
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Gorra",
                description: "Gorra snapback negra con logo bordado",
                price: 25,
                category: "ropa urbana",
                stock: 40,
                identity: 9
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Tenis",
                description: "Zapatillas deportivas blancas de suela gruesa",
                price: 75,
                category: "ropa urbana",
                stock: 22,
                identity: 10
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });
            // Ropa vintage
            new Clothes({
                name: "Chaqueta",
                description: "Chaqueta de mezclilla desgastada estilo retro",
                price: 65,
                category: "ropa vintage",
                stock: 10,
                identity: 11
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Vestido",
                description: "Vestido floral de los años 70 con vuelo",
                price: 70,
                category: "ropa vintage",
                stock: 8,
                identity: 12
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Jersey",
                description: "Suéter de lana con patrones retro",
                price: 55,
                category: "ropa vintage",
                stock: 15,
                identity: 13
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Botines",
                description: "Botines marrones de gamuza con tacón bajo",
                price: 85,
                category: "ropa vintage",
                stock: 12,
                identity: 14
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Pañuelo",
                description: "Pañuelo de seda con estampado de los años 50",
                price: 30,
                category: "ropa vintage",
                stock: 20,
                identity: 15
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });
            // Ropa deportiva
            new Clothes({
                name: "Leggings",
                description: "Leggings de compresión para entrenamiento",
                price: 45,
                category: "ropa deportiva",
                stock: 35,
                identity: 16
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Short",
                description: "Short deportivo de secado rápido",
                price: 35,
                category: "ropa deportiva",
                stock: 40,
                identity: 17
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Top",
                description: "Top deportivo de sujeción media",
                price: 30,
                category: "ropa deportiva",
                stock: 28,
                identity: 18
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Sudadera",
                description: "Sudadera técnica con cremallera",
                price: 60,
                category: "ropa deportiva",
                stock: 20,
                identity: 19
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Zapatillas",
                description: "Zapatillas running con amortiguación avanzada",
                price: 95,
                category: "ropa deportiva",
                stock: 18,
                identity: 20
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });
            // Ropa bohemia
            new Clothes({
                name: "Kimono",
                description: "Kimono de lino con estampado étnico",
                price: 55,
                category: "ropa bohemia",
                stock: 15,
                identity: 21
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Blusa",
                description: "Blusa de gasa con bordados artesanales",
                price: 45,
                category: "ropa bohemia",
                stock: 25,
                identity: 22
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Pantalón",
                description: "Pantalón ancho de lino fresco",
                price: 50,
                category: "ropa bohemia",
                stock: 18,
                identity: 23
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Sandalias",
                description: "Sandalias de cuero con detalles artesanales",
                price: 70,
                category: "ropa bohemia",
                stock: 10,
                identity: 24
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Sombrero",
                description: "Sombrero de ala ancha de paja",
                price: 40,
                category: "ropa bohemia",
                stock: 12,
                identity: 25
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            // Ropa minimalista
            new Clothes({
                name: "Camisa",
                description: "Camisa blanca sin botones visibles, de algodón premium",
                price: 55,
                category: "ropa minimalista",
                stock: 20,
                identity: 26
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Pantalón",
                description: "Pantalón negro recto sin costuras visibles",
                price: 65,
                category: "ropa minimalista",
                stock: 15,
                identity: 27
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Sweater",
                description: "Suéter gris de lana merino sin estampados",
                price: 75,
                category: "ropa minimalista",
                stock: 18,
                identity: 28
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Zapatillas",
                description: "Zapatillas blancas de cuero sin detalles",
                price: 85,
                category: "ropa minimalista",
                stock: 12,
                identity: 29
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Abrigo",
                description: "Abrigo largo negro con corte estructurado",
                price: 120,
                category: "ropa minimalista",
                stock: 10,
                identity: 30
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });
            // Ropa de diseñador
            new Clothes({
                name: "Traje",
                description: "Traje exclusivo de diseñador con cortes elegantes",
                price: 250,
                category: "ropa de diseñador",
                stock: 8,
                identity: 31
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Vestido",
                description: "Vestido de seda rojo con diseño exclusivo",
                price: 300,
                category: "ropa de diseñador",
                stock: 5,
                identity: 32
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Chaqueta",
                description: "Chaqueta de piel de alta gama con detalles únicos",
                price: 400,
                category: "ropa de diseñador",
                stock: 6,
                identity: 33
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Pantalón",
                description: "Pantalón de sastre azul marino con corte impecable",
                price: 220,
                category: "ropa de diseñador",
                stock: 7,
                identity: 34
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

            new Clothes({
                name: "Zapatos",
                description: "Zapatos de cuero hechos a mano por diseñador exclusivo",
                price: 500,
                category: "ropa de diseñador",
                stock: 4,
                identity: 35
            }).save((err) => {
                if (err) {
                    console.log("Error al crear la ropa")
                }
            });

        }
    })
    Coupons.estimatedDocumentCount((err, count) => {
        if (!err & count === 0) {
            new Coupons({
                code: "DESCUENTO10",
                percentage: 10,
                expirationDate: new Date("2025-05-01")
            }).save((err) => {
                if (err) {
                    console.log("Error al crear el cupón")
                }
            });
            new Coupons({
                code: "OFERTA20",
                percentage: 20,
                expirationDate: new Date("2025-04-09")
            }).save((err) => {
                if (err) {
                    console.log("Error al crear el cupón")
                }
            });
            new Coupons({
                code: "PROMOCION30",
                percentage: 30,
                expirationDate: new Date("2025-04-01")
            }).save((err) => {
                if (err) {
                    console.log("Error al crear el cupón")
                }
            });
        }
    })


}



app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`)
})