const express = require('express');
const router = express.Router();
const Production = require('../../../model/Production');

router.get('/', async(req, res) => {
  try {
    const products = await Production.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({message:error.message});
  }
});

router.post('/', async(req, res) => {
  
  const newProduction = new Production(req.body);

  try {
    const savedProduction = await newProduction.save();
    const updatedProduction = await Production.find();
    res.status(201).json(updatedProduction);
  } catch (error) {
    res.status(400).json({message:error.message});
  }
})


router.delete('/', async(req, res)=> {
  try {
    const {price} = req.body;
    const result = await Production.deleteOne({price});
    res.status(200).json({message:`${result.deletedCount} productions deleted`});
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


module.exports = router;