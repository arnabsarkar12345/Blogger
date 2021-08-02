//PACKAGES
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer(""));

//MONGOOSE MODEL CONFIG
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_app", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false
 });
var blogSchema = new mongoose.Schema({
    name : String,
    image : String,
    body : String,
    created : {type: Date, default: Date.now},
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/",function(req , res){
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req , res){
    Blog.find({},function(err, blogs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index" , {blogs : blogs});
        }
    });
    
});
//NEW ROUTE
app.get("/blogs/new",function(req , res){
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req , res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err, newBlog){
    if(err)
    {
        res.render("new");
    }
    else
    {
        res.redirect("/blogs");
    }
});
});
//SHOW ROUTE
app.get("/blogs/:id",function(req , res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show" , {blog : foundBlog});
        }
    });
});
//EDIT ROUTES
app.get("/blogs/:id/edit",function(req , res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit" , {blog : foundBlog});
        }
    });
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req , res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err, updatedBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//DELETE ROUTE
app.delete("/blogs/:id",function(req , res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function () {
    console.log("Blog server has started!!!");
});