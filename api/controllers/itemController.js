const Item = require("../models/Items");

// GET ITEMS
exports.getItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

// CREATE ITEM
exports.createItem = async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
};