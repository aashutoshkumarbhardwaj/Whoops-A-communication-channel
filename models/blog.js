const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},
    {timestamps:true}
);

const Blog= model("Blog", blogSchema);

module.exports = Blog;