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

    app.put('/api/updateprice',[authJwt.verifyToken, authJwt.isAdmin],functions.updatePrice);

    app.delete('/api/deleteclothescart',[authJwt.verifyToken],functions.deleteClothesInCart);

    app.get('/api/getClothesByLetter',authJwt.verifyToken,functions.filterByLetter);

    app.delete('/api/deletecategory',[authJwt.verifyToken, authJwt.isAdmin],functions.deleteCategory);

    app.post('/api/payment',authJwt.verifyToken,functions.paymentStripe);

    app.post('/api/createcoupon',[authJwt.verifyToken, authJwt.isAdmin],functions.createCoupon);

    app.delete('/api/deletecoupon',[authJwt.verifyToken, authJwt.isAdmin],functions.deleteCoupon);

    app.get('/api/getCoupons',[authJwt.verifyToken, authJwt.isAdmin],functions.getCoupons);

    app.put('/api/updatepercentage',[authJwt.verifyToken, authJwt.isAdmin],functions.updatePercentage);
}