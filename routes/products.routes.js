// post.routes.js

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/products', (req, res) => {
  req.db
    .collection('products')
    .find()
    .toArray()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

router.get('/products/random', (req, res) => {
  req.db
    .collection('products')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(([data]) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

router.get('/products/:id', (req, res) => {
  req.db
    .collection('products')
    .findOne({ _id: ObjectId(req.params.id) })
    .then((data) => {
      if (!data) res.status(404).json({ message: 'Not found' });
      else res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post('/products', (req, res) => {
  const { name, client } = req.body;
  if (!name || !client)
    return res.status(400).json({ message: 'No name or client found...' });
  req.db
    .collection('products')
    .insertOne({ name, client })
    .then(() => {
      res.json({ message: 'OK' });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.put('/products/:id', (req, res) => {
  const { name, client } = req.body;
  if (!name || !client)
    return res.status(400).json({ message: 'No name or client found...' });
  req.db
    .collection('products')
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: { name, client } })
    .then(({ modifiedCount }) => {
      modifiedCount > 0
        ? res.json({ message: 'OK' })
        : res.json({ message: 'Not found...' });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.delete('/products/:id', (req, res) => {
  req.db
    .collection('products')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(({ deletedCount }) => {
      deletedCount > 0
        ? res.json({ message: 'OK' })
        : res.json({ message: 'Not found...' });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

module.exports = router;
