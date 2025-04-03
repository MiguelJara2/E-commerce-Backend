const db = require("../models");
const Clothes = db.clothes;
const Cart = db.cart;
const User = db.user;
const jwt = require("jsonwebtoken");
exports.allAccess=(req,res)=>{
    res.status(200).send("Contenido Publico")
}

exports.userBoard=(req,res)=>{
    res.status(200).send("Contenido del USer")
}

exports.moderatorBoard=(req,res)=>{
    res.status(200).send("Contenido del moderador")
}

exports.adminBoard=(req,res)=>{
    res.status(200).send("Contenido del Admin")
}

exports.clothesBoard = (req, res) => {
    Clothes.find({})
        .select("description price stock identity") // Seleccionar solo los campos deseados
        .exec((err, clothes) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(200).send(clothes); // Enviar los resultados con los campos seleccionados
        });
};

exports.addCart = async (req, res) => {
    try {
        const { identity, quantity} = req.body;
        const userId = req.userId; // Obtener el ID del usuario del token
        // Buscar el producto por su identity
        const product = await Clothes.findOne({ identity: identity });
        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).send({ message: "No hay suficiente stock" });
        }

        // Reducir el stock del producto
        product.stock -= quantity;
        await product.save();

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            // Si no existe el carrito, crear uno nuevo
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.items.find(item => item.productId.toString() === product._id.toString());
        if (existingItem) {
            // Incrementar la cantidad si ya existe
            existingItem.quantity += quantity;
            existingItem.price = existingItem.quantity * product.price;
        } else {
            // Agregar el producto al carrito si no existe
            cart.items.push({
                productId: product._id,
                identity: product.identity,
                quantity: quantity,
                price: product.price * quantity
            });
        }

        // Actualizar el precio total del carrito
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

        // Guardar el carrito actualizado
        await cart.save();

        res.status(200).send({ message: "Producto añadido al carrito", cart });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};




