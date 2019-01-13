var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/todo_list",{useNewUrlParser: true});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
//Schema Setup
var todoSchema = new mongoose.Schema({
	text: String
});
var Todo = mongoose.model("Todo", todoSchema);

// Todo.create(
//     {
//          text: "Go To Byju"
//     },
//     function(err, todo){
//     	if(err)
//     		console.log(err);
//     	else{
//     		console.log("Newly Created Todo: ");
//     		console.log(todo);
//     	}
//     }
// 	);

//RESTFUL ROUTE
 app.get("/",function(req,res){
 	res.redirect("/todos");
 });
 //INDEX ROUTE
app.get("/todos",function(req,res){
	Todo.find({}, function(err, allTodos){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{todos:allTodos});
		}
	 });
});

//NEW ROUTE
app.get("/todos/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/todos",function(req,res){
    req.body.todo.text = req.sanitize(req.body.todo.text);
    var formData = req.body.todo;
    Todo.create(formData,function(err,newTodo){
    	if(err){
    		res.render("new");
    	}
    	else{
    		res.redirect("/todos");
    	}
    })
});
//EDIT ROUTE
app.get("/todos/:id/edit", function(req, res){
 Todo.findById(req.params.id, function(err, todo){
   if(err){
     console.log(err);
     res.redirect("/");
   } else {
      res.render("edit", {todo: todo});
   }
 });
});
//UPDATE ROUTE
app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.redirect('/');
   }
 });
});
//DELETE ROUTE
app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.redirect("/todos");
   }
 }); 
});

app.listen(3000,function(){
	console.log("Server running on port 3000");
})


