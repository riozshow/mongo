const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/employees', (req, res) => {
  req.db
    .collection('employees')
    .find()
    .toArray()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

router.get('/employees/random', (req, res) => {
  req.db
    .collection('employees')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(([data]) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

router.get('/employees/:id', (req, res) => {
  req.db
    .collection('employees')
    .findOne({ _id: ObjectId(req.params.id) })
    .then((data) => {
      if (!data) res.status(404).json({ message: 'Not found' });
      else res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post('/employees', (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: 'No firstName or lastName found...' });
  req.db
    .collection('employees')
    .insertOne({ firstName, lastName })
    .then(() => {
      res.json({ message: 'OK' });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.put('/employees/:id', (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName)
    return res
      .status(400)
      .json({ message: 'No firstName or lastName found...' });
  req.db
    .collection('employees')
    .updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { firstName, lastName } }
    )
    .then(({ modifiedCount }) => {
      modifiedCount > 0
        ? res.json({ message: 'OK' })
        : res.json({ message: 'Not found...' });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.delete('/employees/:id', (req, res) => {
  req.db
    .collection('employees')
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
