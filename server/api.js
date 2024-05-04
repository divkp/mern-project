import schema from "./mongodb.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Token from "./token.js";
import grid from 'gridfs-stream'
import mongoose  from 'mongoose'
import post from "./postmodel.js";
import CommentSchema from "./commentschema.js";

let gfs,gridfsBucket;
const conn=mongoose.connection;
conn.once('open',()=>{
   gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
     bucketName: "fs",
   });
   gfs=grid(conn.db,mongoose.mongo);
   gfs.collection('fs');
})

dotenv.config();
export const signup = async (req, res) => {
  try {
    const user = req.body;
    const newuser = new schema(user);
    await newuser.save();
    return res.status(200).json({
      msg: "signup successfull",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "signup failed",
    });
  }
};

export const login = async (req, res) => {
  const user = await schema.findOne({ username: req.body.username });
  //   console.log(user);
  if (!user) {
    // console.log("h1");
    return res.status(400).json({ msg: "username doesnot exist" });
  }
  try {
    if (user.password === req.body.password) {
      const accesstoken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN, {
        expiresIn: "15m",
      });
      const refreshtoken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN);

      let newtoken = new Token({ token: refreshtoken });
      await newtoken.save();

      return res.status(200).json({
        accesstoken: accesstoken,
        refreshtoken: refreshtoken,
        name: user.name,
        username: user.username,
      });
    } else {
      return res.status(400).json({ msg: "password do not match" });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Error while login" });
  }
};

const url='http://localhost:8000';
export const uploadImage=(req,res)=>{
  console.log(req);
      if(!req.file){
        return res.status(404).json({msg:'file not found'});
      }

      const imageUrl=`${url}/file/${req.file.filename}`
     
      return res.status(200).json(imageUrl);
     
}

export const getImage=async(req,res)=>{
    try{
        const file= await gfs.files.findOne({filename:req.params.filename});
        const readStream=gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
           console.log("get");
    }
    catch(error){
         return res.status(500).json({msg:error.message});
    }
}

export const createpost=async(req,res)=>{
     try{
       const p=await new post(req.body);
       p.save();

       return res.status(200).json({msg:'post saved successfully'});
     }
     catch(error){
        return res.status(500).json(error);
     }
}

export const getAllPosts=async(req,res)=>{
        let category=req.query.category;
        let posts;
        try{
            if(category){
              posts=await post.find({categories:category});
            }
            else{
             posts=await post.find({});
            }
            return res.status(200).json(posts);
        }
        catch(err){
           return res.status(500).json({msg:err.message});
        }
}

export const getPost=async (req,res)=>{
      try{
           const pos=await post.findById(req.params.id);
           return res.status(200).json(pos)
      }
      catch(err){
          return res.status(500).json({msg:err.message})
      }
     
      
}

export const updatePost=async (req,res)=>{
         try{
            console.log('nv')
            let p=await post.findById(req.params.id);
            await post.findByIdAndUpdate(req.params.id,{$set:req.body})
            return res.status(200).json({msg:'post updated successfully'})
         }
         catch(err){
           return res.status(500).json({msg:err.message})
         }
}

export const deletePost = async (req, res) => {
  try {
    console.log("nv");
    let p = await post.findById(req.params.id);
    // await post.findByIdAndDelete(req.params.id);
    await post.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ msg: "post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const Addcomment = async (req, res) => {
  try {
    
    let p = await new CommentSchema(req.body);
    p.save();

    return res.status(200).json({ msg: "comment saved successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
   
    const p = await CommentSchema.find({postId:req.params.id});
    
    return res.status(200).json(p);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    // console.log("nv");
    // let p = await CommentSchema.findById(req.params.id);
    // await post.findByIdAndDelete(req.params.id);
    await CommentSchema.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "comment deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};