//Jshint exversion:6
const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")

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

  Item.find({}, function(err, foundItems) {
    console.log(foundItems);
    if (foundItems.length === 0) {
      Item.insertMany(defaultItem, (err) => {
        if (err) {
      console.log(err);
        } else {
      console.log("data insert successful");
        }
      });
      res.redirect("/")
    } else {
      res.render('list', {listTitle: "Today", foundItems: foundItems});
    }
  });

});

app.get("/:customListName", (req, res)=>{
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName}, (err, foundLists) => {
    // console.log(foundLists);
    if (!err) {
      if (!foundLists) {
        //create a new list
        const list = new List({
          name: customListName,
          items:defaultItem
        })
        list.save();
        //redirect back to the todo page name you enter for ui
        res.redirect("/" + customListName )
      } else {
        //show item that already exit
        res.render("list", {listTitle: foundLists.name, foundItems: foundLists.items})
      }
    }
  })
})

app.post("/", function(req, res){
const newItem = req.body.newItem;
const listName = req.body.list;

const item = new Item({
  name: newItem
})

if (listName === "Today") {
  item.save();
  res.redirect("/")
} else {
  List.findOne({name: listName}, (err, foundLists)=>{
    foundLists.items.push(item)
    foundLists.save()
    res.redirect("/" + listName)
  })
}

});

app.post("/delete", (req, res) => {
  checkboxItemId = req.body.checkbox;
  listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkboxItemId, (err)=>{
      if (err) {
        console.log(err);
      } else {
        console.log("removed");
        res.redirect("/")
      }
    });
  } else {
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id: checkboxItemId}}}, (err, foundLists)=>{
      res.redirect("/" + listName)
    })
  }
})


app.listen(3000, function() {
  console.log("server started on port 3000");
});
