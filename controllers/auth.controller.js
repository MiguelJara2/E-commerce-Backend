const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = db.user;
const Role = db.role;
const Cart = db.cart;
const Clothes = db.clothes;

exports.signup = (req, res) => {
  try {
    let password = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: password,
    });
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              res.send({ message: "Usuario Creado Correctamente" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          console.log(role);
          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Usuario Creado Correctamente" });
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username })
    .populate("roles", "__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        res.status(404).send({ message: "Usuario no encontrado" });
        return;
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        res.status(401).send({ message: "Password Invalido" });
        return;
      }
      const token = jwt.sign({ id: user.id }, process.env.jwtSecret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });
      let authorities = [];
      for (let index = 0; index < user.roles.length; index++) {
        const element = user.roles[index];
        authorities.push(element);
      }
      req.session.token = token;

      // Crear el carrito para el usuario si no existe
      Cart.findOne({ userId: user.id }, async (err, existingCart) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!existingCart) {
          // Crear un nuevo carrito si no existe
          const cart = new Cart({
            userId: user.id, // Usar el ID del usuario obtenido
            items: [],
          });
          try {
            await cart.save(); // Guardar el carrito en la base de datos
            return res.status(200).send({
              id: user.id,
              username: user.username,
              email: user.email,
              roles: authorities,
              message: "Carrito creado correctamente",
            });
          } catch (saveErr) {
            return res.status(500).send({ message: saveErr });
          }
        }

        // Si el carrito ya existe, enviar la respuesta
        return res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          message: "Inicio de sesión exitoso",
        });
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    res.status(200).send({ message: "Tu session ha terminado" });
  } catch (error) {
    this.next(error);
  }
};


exports.updateStock = async (req, res) => {
  try {
    const {identity,quantity} = req.body;
    const product = await Clothes.findOne({ identity: identity });
    if (!product) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    product.stock += quantity;
    await product.save();
    res.status(200).send({ message: "Stock actualizado correctamente",
      product,
     });

  } catch (error) {
    res.status(500).send({ message: error });
    console.log(error)
  }

}

exports.getCart = async (req, res) => {
  try {
    const userId = req.userId; // Obtener el ID del usuario del token
    const cart = await Cart.findOne({ userId: userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

exports.deleteClothe= async (req, res) => {
  try {
    const { identity } = req.body;
    const product = await Clothes.findOne({ identity: identity });
    if (!product) {
      return res.status(404).send({ message: "Producto no encontrado" });
    }
    await product.remove();
    res.status(200).send({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

exports.addClothes = async (req, res) => {
  try {
    // Verificar si el producto ya existe
    
    
    const { name, description, price, category, stock,identity} = req.body;
    const existingProduct = await Clothes.findOne({ identity: identity });
    if (existingProduct) {
      return res.status(400).send({ message: "El producto ya existe" });
    }
    //Crear un nuevo producto
    const newClothes = new Clothes({
      name,
      description,
      price,
      category,
      stock,
      identity
    });
    await newClothes.save();
    res.status(200).send({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}


