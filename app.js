const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = ({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);
 
//////////////////////////////////////////requests targeting a specific articles/////////////////////////////////
 
 app.route("/articles")
 .get(async(req, res)=> { 
    try{
        const foundArticles = await Article.find();
        res.send(foundArticles);
    } catch (err) {
        console.log(err);
    }
})
.post(async(req, res)=>{
    try{
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
           });
          await newArticle.save
          res.send("Successfully added articles");
    }catch (err) {
        console.log(err);
    }
})
.delete(async(req, res)=>{
    try{
     await Article.deleteMany();
    res.send("Successfully deleted articles");
    }catch (err) {
        console.log(err);
    }
});

//////////////////////////////////////////requests targeting a specific articles/////////////////////////////////

app.route("/articles/:articleTitle")

.get(async(req, res)=>{
    try{
        const foundArticles = await Article.findOne({title: req.params.articleTitle});
        if (foundArticles) {
            res.send(foundArticles);
        } else{
            res.send("No articles found");
        };

    } catch (err){
        console.log(err);
    }
})

.put(async(req, res)=>{
    try{
        await Article.replaceOne({title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content});
            res.send("Successfully updated articles");
    } catch (err){
        console.log(err);
    }
})

.patch(async(req, res)=>{
    try{
        await Article.updateOne({title: req.params.articleTitle}, {$set: req.body});
        res.send("Successfully patched articles");
    } catch(err){
        console.log(err);
    }
})

.delete(async(req, res)=>{
    try{
        await Article.deleteOne({title: req.params.articleTitle});
        res.send("Successfully deleted articles");

    }catch(err){
        console.log(err);
    }
});


app.listen(3000, function(){
    console.log("Server started on port 3000")
});