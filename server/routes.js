// const express=express();
import express from 'express';
const router=express.Router();
import {signup} from './api.js'
import { login } from './api.js';
import {uploadImage} from './api.js';
import upload from './upload.js'
import { getImage } from './api.js';
import { createpost } from './api.js';
import {getAllPosts,getPost,updatePost,deletePost,Addcomment,getAllComments,deleteComment} from './api.js'
import jwt from 'jsonwebtoken';


const authenticatetoken=(req,res,next)=>{
   const token=req.headers.authorization.split(' ')[1];
   console.log(token)

   // if(token==null){
   //  return res.status(401).json({msg:'token is null'});
   // }
   jwt.verify(token, process.env.ACCESS_TOKEN,(error,user)=>{
    if(error){
         return res.status(403).json({ msg: "invalid token" });
    }

     req.user=user;
     next();
   });
}
router.post('/signup',signup);
router.post("/login", login);
router.post("/file/upload",upload.single('file'),uploadImage);
router.get("/file/:filename",getImage);
router.post("/create" ,authenticatetoken,createpost);
router.get("/posts",authenticatetoken,getAllPosts);
router.get("/post/:id", authenticatetoken, getPost);
router.put("/update/:id",authenticatetoken,updatePost);
router.delete("/delete/:id", authenticatetoken, deletePost);
router.post("/comment/new", authenticatetoken, Addcomment);
router.get("/comment/:id", authenticatetoken, getAllComments);
router.delete("/deletecomment/:id", authenticatetoken, deleteComment);
export default router;