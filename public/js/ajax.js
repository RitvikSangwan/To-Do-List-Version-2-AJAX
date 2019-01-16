"use strict";

$("#new-todo-form").submit(function (e) {
	e.preventDefault();
	var toDoItem = $(this).serialize();
	$.post("/todos", toDoItem, function (data) {
		$("#todo-list").append("\t\n        <li class=\"list-group-item\">\n                <form action=\"/todos/" + data._id + "\" method=\"POST\" class=\"edit-item-form\">\n\t\t\t        <div class=\"form-group\">\n\t\t\t\t        <label>Item Text</label>\n\t\t\t\t        <input type=\"text\" value=\"" + data.text + "\" name=\"todo[text]\" class=\"form-control\">\n\t\t\t        </div>\n\t\t\t        <button class=\"btn btn-primary\">Update Item</button>\n\t\t        </form>\n\t\t\t\t\t<span class=\"lead\">\n\t\t\t\t\t" + data.text + "\n\t\t\t\t\t</span>\n\t\t\t\t\t<div class=\"pull-right\">\n\t\t\t\t\t\t<button class=\"btn btn-sm btn-warning edit-button\">Edit</button>\n\t\t\t\t\t\t<form style=\"display: inline\" method=\"POST\" action=\"/todos/" + data._id + "\" class=\"delete-item-form\">\n\t\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-sm btn-danger\">Delete</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"clearfix\"></div>\n\t\t\t\t</li>\n\t\t");
		$("#new-todo-form").find(".form-control").val("");
	});
});
//we will not add click listener to edit-button directly because any new item will then not have click listener
// associated with it. We will therefore add click listener to a static parent of edit-button that is
//the one having the id todo-list
$("#todo-list").on("click", ".edit-button", function () {
	//edit button parent is div pull right and div pull right sibling is class edit-item-form
	$(this).parent().siblings('.edit-item-form').toggle();
});

$('#todo-list').on('submit', '.edit-item-form', function (e) {
	e.preventDefault();
	var toDoItem = $(this).serialize();
	var actionUrl = $(this).attr('action');
	var $originalItem = $(this).parent('.list-group-item');
	$.ajax({
		url: actionUrl,
		data: toDoItem,
		type: 'PUT',
		originalItem: $originalItem,
		success: function success(data) {
			this.originalItem.html("\n\t\t\t\t<form action=\"/todos/" + data._id + "\" method=\"POST\" class=\"edit-item-form\">\n\t\t\t        <div class=\"form-group\">\n\t\t\t\t        <label>Item Text</label>\n\t\t\t\t        <input type=\"text\" value=\"" + data.text + "\" name=\"todo[text]\" class=\"form-control\">\n\t\t\t        </div>\n\t\t\t        <button class=\"btn btn-primary\">Update Item</button>\n\t\t        </form>\n\t\t\t\t\t<span class=\"lead\">\n\t\t\t\t\t\t" + data.text + "\n\t\t\t\t\t</span>\n\t\t\t\t\t<div class=\"pull-right\">\n\t\t\t\t\t\t<button class=\"btn btn-sm btn-warning edit-button\">Edit</button>\n\t\t\t\t\t\t<form style=\"display: inline\" method=\"POST\" action=\"/todos/" + data._id + "\" class=\"delete-item-form\">\n\t\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-sm btn-danger\">Delete</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"clearfix\"></div>\n\t\t\t\t");
		}
	});
});
// Delete To Do Item

$('#todo-list').on('submit', '.delete-item-form', function (e) {
	e.preventDefault();
	var confirmResponse = confirm('Are you sure?');
	if (confirmResponse) {
		var actionUrl = $(this).attr('action');
		var $itemToDelete = $(this).closest('.list-group-item');
		$.ajax({
			url: actionUrl,
			type: 'DELETE',
			itemToDelete: $itemToDelete,
			success: function success(data) {
				this.itemToDelete.remove();
			}
		});
	} else {
		$(this).find('button').blur();
	}
});
// Search functionality

$('#search').on('input', function (e) {
	e.preventDefault();
	$.get("/todos?keyword=" + encodeURIComponent(e.target.value), function (data) {
		$('#todo-list').html('');
		data.forEach(function (todo) {
			$('#todo-list').append("\n\t\t\t\t<li class=\"list-group-item\">\n\t\t\t\t\t<form action=\"/todos/" + todo._id + "\" method=\"POST\" class=\"edit-item-form\">\n\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t<label for=\"" + todo._id + "\">Item Text</label>\n\t\t\t\t\t\t\t<input type=\"text\" value=\"" + todo.text + "\" name=\"todo[text]\" class=\"form-control\" id=\"" + todo._id + "\">\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<button class=\"btn btn-primary\">Update Item</button>\n\t\t\t\t\t</form>\n\t\t\t\t\t<span class=\"lead\">\n\t\t\t\t\t\t" + todo.text + "\n\t\t\t\t\t</span>\n\t\t\t\t\t<div class=\"pull-right\">\n\t\t\t\t\t\t<button class=\"btn btn-sm btn-warning edit-button\">Edit</button>\n\t\t\t\t\t\t<form style=\"display: inline\" method=\"POST\" action=\"/todos/" + todo._id + "\" class=\"delete-item-form\">\n\t\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-sm btn-danger\">Delete</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"clearfix\"></div>\n\t\t\t\t</li>\n\t\t\t\t");
		});
	});
});

// $.get("/todos",function(data){
// 	console.log(data);
// })
// $("form").submit(function(e){
// 	e.preventDefault();
// 	//serialize() returns us a string object
// 	var formData = $(this).serialize();
// 	$.post("/todos",formData,function(data){
// 		console.log(data);
// 	})
// })
// $("form").submit(function(e){
// 	e.preventDefault();
// 	var formData = $(this).serialize();
// 	//$(this).attr("action") will return us a URL in the form of string
// 	var formAction = $(this).attr("action");
// 	$.ajax({
// 		url: formAction,
// 		data: formData,
// 		type: "PUT",
//CALLBACK FUNCTION
// 		success: function(data){
// 			console.log(data);
// 		}
// 	})
// })
// $("form").submit(function(e){
// 	e.preventDefault();
// 	//$(this).attr("action") will return us a URL in the form of string
// 	var formAction = $(this).attr("action");
// 	$.ajax({
// 		url: formAction,
// 		type: "DELETE",
// 		//CALLBACK FUNCTION
// 		success: function(data){
// 			console.log(data);
// 		}
// 	})
// })