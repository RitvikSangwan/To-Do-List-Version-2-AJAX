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
app.get("/", function(req, res){
  res.redirect("/todos");
});
// function to be used in the .get("/todos"..) route
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.get("/todos", function(req, res){
  if(req.query.keyword) {
    const regex = new RegExp(escapeRegex(req.query.keyword), 'gi');
    Todo.find({ text: regex }, function(err, todos){
      if(err){
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  } else {
    Todo.find({}, function(err, todos){
      if(err){
        console.log(err);
      } else {
        if(req.xhr) {
          res.json(todos);
        } else {
          res.render("index", {todos: todos}); 
        }
      }
    });
  }
});
//NEW ROUTE
app.get("/todos/new",function(req,res){
    res.render("new");
});
//CREATE ROUTE
app.post("/todos", function(req, res){
 req.body.todo.text = req.sanitize(req.body.todo.text);
 var formData = req.body.todo;
 Todo.create(formData, function(err, newTodo){
    if(err){
      res.render("new");
    } else {
          res.json(newTodo);
    }
  });
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
	//{new:true} is used to tell the callback function that the todo is a newitem and not the original item
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, {new:true}, function(err, todo){
   if(err){
     console.log(err);
   } else{
   	 	res.json(todo);
   }
 });
});
//DELETE ROUTE
app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
   	res.json(todo);
}
 }); 
});

app.listen(3000,function(){
	console.log("Server running on port 3000");
})


