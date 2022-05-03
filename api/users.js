import express from "express";
import {check, validationResult} from "express-validator";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import config from "config";
import User from "../models/User.js"

const router = express.Router();

router.get("/", (req,res) => res.send("Test users route"));

router.post("/",
 [
     check("name", "Name is required").not().isEmpty(),
     check("email", "Please use a valid email").isEmail(),
     check("password", "The password must contain at least 4 characters").isLength({min:4}),
 ], 
 async (req,res) => {
    
     const errors = validationResult(req);
  
     if (!errors.isEmpty()) {
         return res.status(400).json({errors: errors.array()});
     } 
     else {
         const {name, email, password} = req.body;
         console.log(name, email, password);

         try {
            //  check if user exists
             let user = await User.findOne({email: email});
             console.log(user);

             if (user) {
                 return res.status(400).json({errors: [{msg: "User already exists"}]});
             }
            //  get gravatar
             const avatar = gravatar.url(email, {
                 s:'200',
                 r:'pg',
                 d: 'mm',
             })

             user = new User({name: name, email:email, password: password, avatar: avatar})
             console.log(user);

             await user.save();
             return res.status(201).json(user);
             console.log(avatar);

         } catch (error) {
            res.status(500).send('Server error!!');
         }
     }
 }
);
export default router;