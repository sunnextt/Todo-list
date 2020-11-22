//Jshint exversion:6
const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

//connect you server to mongodb
mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false});

//create item schema for item
const itemSchema = ({
  name: "string"
});

const Item = mongoose.model("item", itemSchema)

const item1 = new Item({
  name: "Welcome to your todo list"
})

const item2 = new Item({
  name: "Hit the + button to add to new todo"
})

const item3 = new Item({
  name: "<-- Hit this to delete an item"
})

const defaultItem = [item1, item2, item3]

const listSchema = ({
  name: "String",
  items: [itemSchema],
})

const List = mongoose.model("list", listSchema)



// create a home server
app.get("/", function(req, res){

  Item.find({}, (err, foundItem)=>{
    if (foundItem.length === 0) {
      Item.insertMany(defaultItem, (err) => {
        if (err) {
      console.log(err);
        } else {
      console.log("data insert successful");
        }
      });
      res.redirect("/")
    } else {
      res.render('list', {listTitle: "Today", foundItem: foundItem});
    }
  });

});

app.get("/:customListName", (req, res)=>{
  const customListName = req.params.customListName;
  const list = new List({
    name: customListName,
    items:defaultItem
  })
list.save();
})

app.post("/", function(req, res){
const newItem = req.body.newItem;

const item = new Item({
  name: newItem
})
item.save();
res.redirect("/")


// const itemHeading = req.body.list
// if (itemHeading === "Work"){
//   workItems.push(item);
//   res.redirect("/work");
// } else {
//   items.push(item);
//   res.redirect("/");
// }

});

app.post("/delete", (req, res) => {
  checkboxItemId = req.body.checkbox;
  console.log(checkboxItemId);

  Item.findByIdAndRemove(checkboxItemId, (err)=>{
    if (err) {
      console.log(err);
    } else {
      console.log("removed");
      res.redirect("/")
    }
  });
})


app.listen(3000, function() {
  console.log("server started on port 3000");
});
