const db = require("../models");
const Clothes = db.clothes;
const Cart = db.cart;
const User = db.user;
const Payments = db.payments;
const jwt = require("jsonwebtoken");
const SKSTRIPE = process.env.skey;
const stripe = require('stripe')(SKSTRIPE);



exports.allAccess = (req, res) => {
    res.status(200).send("Contenido Publico")
}

exports.userBoard = (req, res) => {
    res.status(200).send("Contenido del USer")
}

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Contenido del moderador")
}

exports.adminBoard = (req, res) => {
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
        const { identity, quantity } = req.body;
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

exports.updatePrice = async (req, res) => {
    try {
        const { identity, price } = req.body;
        const userId = req.userId; // Obtener el ID del usuario del token

        // Buscar el producto por su identity
        const product = await Clothes.findOne({ identity: identity });
        if (!product) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        // Actualizar el precio del producto
        product.price = price;
        await product.save();

        res.status(200).send({ message: "Precio actualizado", product });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.deleteClothesInCart = async (req, res) => {
    try {
        const { identity } = req.body;
        const userId = req.userId; // Obtener el ID del usuario del token

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        // Buscar el producto en el carrito
        const itemIndex = cart.items.findIndex(item => item.identity === identity);
        if (itemIndex === -1) {
            return res.status(404).send({ message: "Producto no encontrado en el carrito" });
        }

        // Eliminar el producto del carrito
        const item = cart.items[itemIndex];
        cart.items.splice(itemIndex, 1);

        // Actualizar el stock del producto
        const product = await Clothes.findOne({ identity: identity });
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }

        // Actualizar el precio total del carrito
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

        // Guardar el carrito actualizado
        await cart.save();

        res.status(200).send({ message: "Producto eliminado del carrito", cart });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.filterByLetter = async (req, res) => {
    try {
        const { letter } = req.body;
        const userId = req.userId; // Obtener el ID del usuario del token

        // Buscar los productos que comienzan con la letra especificada
        const filteredProducts = await Clothes.find({
            name: { $regex: `^${letter}`, $options: 'i' } // Insensible a mayúsculas y minúsculas
        });

        if (filteredProducts.length === 0) {
            return res.status(404).send({ message: "No se encontraron productos" });
        }

        res.status(200).send(filteredProducts);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { category } = req.body;

        // Validar que se haya proporcionado la categoría
        if (!category) {
            return res.status(400).send({ message: "La categoría es requerida" });
        }

        // Eliminar los productos de la categoría
        const result = await Clothes.deleteMany({ category: category });

        // Verificar si se eliminaron productos
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "No se encontraron productos en la categoría especificada" });
        }

        res.status(200).send({ message: `Se eliminaron ${result.deletedCount} productos de la categoría "${category}"` });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.paymentStripe = async (req, res) => {
    try {
        const userId = req.userId; // Obtener el ID del usuario del token
        const paymentMethod = req.body.paymentMethod; // Método de pago card
        let discount = 0; // Inicializar el descuento
        if (req.body.coupon) {
            const couponCode = req.body.coupon; // Obtener el código de cupón del cuerpo de la solicitud
            const coupon = await db.coupon.findOne({ code: couponCode }); // Buscar el cupón en la base de datos
            if (!coupon) {
                return res.status(404).send({ message: "Cupón no encontrado" });
            }
            if (coupon.expirationDate< new Date()) {
                return res.status(400).send({ message: "El cupón ha expirado" });
            }
            discount = coupon.percentage; // Obtener el porcentaje de descuento del cupón
        }

        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ message: "Carrito no encontrado" });
        }

        if (cart.items.length === 0) {
            return res.status(400).send({ message: "El carrito está vacío" });
        }
        const totalPrice = cart.totalPrice; // Obtener el precio total del carrito
        // Crear un nuevo pago en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: (cart.totalPrice * 100)-((cart.totalPrice * 100) * (discount / 100)), // Monto total en centavos
            currency: 'usd',
            payment_method_types: [paymentMethod],
        });
        // Confirmar el pago
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
            payment_method: 'pm_card_visa', // Método de pago de prueba
        });
        // Guardar el pago en la base de datos
        const payment = new Payments({
            userId: userId,
            paymentID: paymentIntent.id,
            items: cart.items,
            totalPrice: paymentIntent.amount / 100, // Monto total en dólares
            paymentMethod: paymentMethod,
        });
        await payment.save();
        // Limpiar el carrito después del pago
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(200).send({message:"Pago realizado con éxito. Monto original "+totalPrice+" Monto con descuento "+(paymentIntent.amount)/100+" Cupón aplicado "+discount+"% Descuento"});
    } catch (error) {
        console.error("Error en el proceso de pago:", error);
        return res.status(500).send({ message: "Error en el proceso de pago" });
    }
}


exports.createCoupon = async (req, res) => {
    try {
        const { code, percentage, expirationDate } = req.body;

        // Validar que se hayan proporcionado todos los campos requeridos
        if (!code || !percentage || !expirationDate) {
            return res.status(400).send({ message: "Todos los campos son requeridos" });
        }

        // Crear un nuevo cupón
        const coupon = new db.coupon({
            code,
            percentage,
            expirationDate,
        });

        await coupon.save();
        res.status(201).send({ message: "Cupón creado con éxito", coupon });
    } catch (error) {
        console.error("Error al crear el cupón:", error);
        return res.status(500).send({ message: "Error al crear el cupón" });
    }
}

exports.deleteCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        // Validar que se haya proporcionado el código del cupón
        if (!code) {
            return res.status(400).send({ message: "El código del cupón es requerido" });
        }

        // Eliminar el cupón de la base de datos
        const result = await db.coupon.deleteOne({ code: code });

        // Verificar si se eliminó el cupón
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Cupón no encontrado" });
        }

        res.status(200).send({ message: "Cupón eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar el cupón:", error);
        return res.status(500).send({ message: "Error al eliminar el cupón" });
    }
}

exports.getCoupons = async (req, res) => {
    try {
        const coupons = await db.coupon.find({});
        res.status(200).send(coupons);
    } catch (error) {
        console.error("Error al obtener los cupones:", error);
        return res.status(500).send({ message: "Error al obtener los cupones" });
    }
}

exports.updatePercentage = async (req, res) => {
    try {
        const { code, percentage } = req.body;

        // Validar que se hayan proporcionado todos los campos requeridos
        if (!code || !percentage) {
            return res.status(400).send({ message: "Todos los campos son requeridos" });
        }

        // Actualizar el porcentaje del cupón
        const coupon = await db.coupon.findOneAndUpdate(
            { code },
            { percentage },
            { new: true } // Devuelve el documento actualizado
        );

        if (!coupon) {
            return res.status(404).send({ message: "Cupón no encontrado" });
        }

        res.status(200).send({ message: "Porcentaje del cupón actualizado con éxito", coupon });
    } catch (error) {
        console.error("Error al actualizar el porcentaje del cupón:", error);
        return res.status(500).send({ message: "Error al actualizar el porcentaje del cupón" });
    }
}




