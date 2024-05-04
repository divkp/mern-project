import mongoose from "mongoose";

const commentschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     postId:{
        type:String,
        required:true
    },
     date:{
        type:Date,
        required:true
    },
     comments:{
        type:String,
        required:true
    }
})


const CommentSchema=mongoose.model('comments',commentschema)

export default CommentSchema;