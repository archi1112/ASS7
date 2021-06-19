const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../modals/user')


const HttpError = require('../utilities/http-error');
const { reset } = require('nodemon');

const userSignup = async (req, res, next) => {
    // console.log(req.body);

    const { name, age, email, password , dateOfBirth } = req.body;    
    

    let existingUser;
    try {
        // to find existing user
        existingUser = await User.findOne({ email: email });

    } catch (err) {
        const error = new HttpError("signup failed ,try again later!", 500);
        return next(error);
    }
    if (existingUser) {
        const error = new HttpError("user already exists(email already in use)", 422);
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (err) {
        const error = new HttpError("Password encryption failed", 500);
        return next(error);
      }
    
 //    user create
        const createdUser = new User({
        firstName: firstName,
        lastName : lastName,
        email: email,
        password: hashedPassword,
        dateOfBirth:dateOfBirth||0
        });

    try {
        await createdUser.save();
        
    } catch (err) {
        const error = new HttpError('signup failed', 500);
        return next(error);
    }
        let token;
        try {
                
                token = jwt.sign(
                    { userId:existingUser.id, 
                     firstName:existingUser.firstName,
                    email: existingUser.email,
                    dateOfBirth:existingUser.dateOfBirth, 
                    }, 
                    "userSecretKey",
                     { expiresIn: "1h" }
                );
                
            console.log(token);
            }catch(err) 
                {
                const error = new HttpError("invalid credentials", 500);
                return next(error);
                }
                return res.json(
            {
                'firstName':existingUser.firstName,
                'email': existingUser.email,
                'dateOfBirth': existingUser.dateOfBirth,
                'token':token
            }
           
        )
    };



const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({ email: email },);
    }
    catch (err) {
        const error = new HttpError("login failed", 500)
        return next(error);
    }
    if (!existingUser) {
        const error = new HttpError("invalid user credentials", 403)
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch {
        const error = new HttpError("login failed", 403);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new HttpError("invalid credentials", 403);
        return next(error);
    }

    let token;
    try {
            
            token = jwt.sign(
                { userId:existingUser.id,
                    firstName:existingUser.firstName, 
                email: existingUser.email,
               dateOfBirth:existingUser.dateOfBirth 
                }, 
                "userSecretKey",
                 { expiresIn: "1h" }
            );
            
        console.log(token);
        }catch(err)
            {
            const error = new HttpError("invalid credentials", 500);
            return next(error);
            }
    res.status(200).json({
            'firstName':existingUser.firstName,
            'email': existingUser.email,
            'dateOfBirth':existingUser.dateOfBirth,
            'token':token
        });
};
exports.userSignup = userSignup;
exports.userLogin = userLogin;