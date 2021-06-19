const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../modals/admin')


const HttpError = require('../utils/http-error');
const { reset } = require('nodemon');

const adminSignup = async (req, res, next) => {
    

    const { firstName,lastName, email, password } = req.body;    
    

    let admin;
    try {
        admin = await Admin.findOne({ email: email });

    } catch (err) {
        const error = new HttpError("signup failed ,try again later!", 500);
        return next(error);
    }
    if (admin) {
        const error = new HttpError("admin already exists(email already in use)", 422);
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
     const createdAdmin = new Admin({
        firstName: firstName,
        lastName : lastName,
        email: email,
        password: hashedPassword,
        
        });
 
        let token;
        try {
                
                token = jwt.sign(
                    {
                     firstName:existingAdmin.firstName,
                     email: existingAdmin.email,
                  
                    }, 
                    "adminSecretKey",
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
                'firstName':existingAdmin.firstName,
                'email': existingAdmin.email,
                'token':token
            }
           
        )
    };



const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    let existingAdmin
    try {
        existingAdmin = await Admin.findOne({ email: email },);
    }
    catch (err) {
        const error = new HttpError("login failed", 500)
        return next(error);
    }
    if (!existingAdmin) {
        const error = new HttpError("invalid user credentials", 403)
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingAdmin.password);
    } catch {
        const error = new HttpError("login failed", 403);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new HttpError("invalid credentials", 403);
        return next(error);
    }
        
    
        try {
            await createdAdmin.save();
            
        } catch (err) {
            const error = new HttpError('signup failed', 500);
            return next(error);
        }
    let token;
    try {
            
            token = jwt.sign(
                { 
                    firstName:existingUser.firstName, 
                email: existingUser.email,
               
                }, 
                "adminSecretKey",
                 { expiresIn: "1h" }
            );
            
        console.log(token);
        }catch(err)
            {
            const error = new HttpError("invalid credentials", 500);
            return next(error);
            }
    res.status(200).json({
            'firstName':existingAdmin.firstName,
            'email': existingAdmin.email,
            'token':token
        });
};