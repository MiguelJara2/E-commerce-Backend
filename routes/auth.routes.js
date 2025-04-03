const userController = require('../controllers/auth.controller')
const {verifySignUp,authJwt}=require('../middlewares');
const functions= require('../controllers/user.controller')

module.exports = function(app){

    app.use(function(req,res,next){
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        )
        next();
    })

    app.post("/api/auth/signup",[
        verifySignUp.checkDuplicateUsernameOrEmail, 
        verifySignUp.checkRolesExited],
    userController.signup)

    app.post('/api/auth/signin', userController.signin)

    app.post('/api/auth/signout', userController.signout);

    app.post('/api/addcart',authJwt.verifyToken ,functions.addCart);

    app.put('/api/updatestock',[authJwt.verifyToken, authJwt.isAdmin] ,userController.updateStock);

    app.delete('/api/deleteclothe',[authJwt.verifyToken, authJwt.isAdmin],userController.deleteClothe);

    app.post('/api/addclothes',[authJwt.verifyToken, authJwt.isAdmin],userController.addClothes);
}