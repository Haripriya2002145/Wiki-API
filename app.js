const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const app=express();

app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.send("Welcome to the Wiki API! You can create, read, update and delete the articles here.")
})

//mongoDB
mongoose.connect("mongodb://127.0.0.1/wikiDB", {useNewUrlParser: true});

//Creating Schema
const articleSchema={
    title: String,
    content: String
}

//Model
const Article=mongoose.model("Articles", articleSchema);

//Targetting all the articles
app.route('/articles')
    .get(function(req, res){
        Article.find()
            .then(function(foundArticles){
                res.send(foundArticles);
            })
            .catch(function(err){
                console.log(err);
            })
    })
    .post(function(req, res){
        const newArticle= new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save()
            .then(function(){
                res.send("Successfully added the article!");
            })
            .catch(function(err){
                res.send(err);
            })
    })
    .delete(function(req, res){
        Article.deleteMany({ "_id": "646b14d0131bfd208714d246" })
            .then(function(){
                res.send("Successfully deleted the record!")
            })
            .catch(function(err){
                res.send(err);
            })
    });

// //Targetting a specific article

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle })
            .then(function (foundArticle) {
                if (foundArticle) {
                    res.send(foundArticle);
                }
                else {
                    res.send("No matching article with the name was found.")
                }
            })
            .catch(function (err) {
                res.send(err);
            })
    })
    .put(function(req, res){
        Article.findOneAndUpdate(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content}, 
            {overwrite: true}
        )
        .then(function(){
            res.send("Successfully updated!");
            console.log("Put performed well...");
        })
        .catch(function(err){
            res.send(err);
        })
    })
    .patch(function(req, res){
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body}//req.body is an object
        )
        .then(function(){
            res.send("Successfully updated the article!");
            console.log("Patch performed well...");
        })
        .catch(function(err){
            res.send(err);
        })
    })
    .delete((req, res)=>{
        Article.deleteOne({title: req.params.articleTitle})
        .then(function(){
            res.send("Deleted the article!")
        })
        .catch(function(err){
            res.send(err)
        })
    });

//listening to port 3000
app.listen(3000, function(){
    console.log("Server listening at port 3000");
})

