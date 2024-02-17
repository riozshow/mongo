const Department = require('../models/department.model');

exports.getAll = (req, res) => {
  Department.find()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err._message }));
};

exports.getRandom = (req, res) => {
  Department.aggregate([{ $sample: { size: 1 } }])
    .then((data) =>
      data ? res.json(data) : res.status(404).json({ message: 'Not found' })
    )
    .catch((err) => res.status(500).json({ message: err._message }));
};
