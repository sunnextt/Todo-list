//Jshint exversion:6
const express = require("express");
const bodyParser = require("body-parser")
const date = require(__dirname + '/date.js');

const app = express();

const items = ["Buy Food","Cook Food", "Eat Food",];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

app.get("/", function(req, res){

const day = date.getDate();

  res.render('list', {listTitle: day, newListItems: items});
});

app.post("/", function(req, res){
const item = req.body.newItem;
const itemHeading = req.body.list

console.log(itemHeading);

if (itemHeading === "Work"){
  workItems.push(item);
  res.redirect("/work");
} else {
  items.push(item);
  res.redirect("/");
}

});

app.get("/work", function(req, res){
  res.render("list", {listTitle: "Work List", newListItems: workItems})
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});