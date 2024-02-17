module.exports = function (router, Model) {
  const pathName = Model.modelName + 's';

  router.get(`/${pathName}`, (req, res) => {
    Model.find()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ message: err._message }));
  });

  router.get(`/${pathName}/random`, (req, res) => {
    Model.aggregate([{ $sample: { size: 1 } }])
      .then((data) =>
        data ? res.json(data) : res.status(404).json({ message: 'Not found' })
      )
      .catch((err) => res.status(500).json({ message: err._message }));
  });

  router.get(`/${pathName}/:id`, (req, res) => {
    Model.findById(req.params.id)
      .then((data) =>
        data ? res.json(data) : res.status(404).json({ message: 'Not found' })
      )
      .catch((err) => res.status(500).json({ message: err._message }));
  });

  router.post(`/${pathName}`, (req, res) => {
    Model.create({ ...req.body })
      .then(() => res.json({ message: 'OK' }))
      .catch((err) => res.status(500).json({ message: err._message }));
  });

  router.put(`/${pathName}/:id`, async (req, res) => {
    Model.findById(req.params.id)
      .then((data) => data.overwrite(req.body))
      .then((data) => data.save())
      .then(() => res.json({ message: 'OK' }))
      .catch((err) => res.json({ message: err._message }));
  });

  router.delete(`/${pathName}/:id`, (req, res) => {
    Model.findById(req.params.id)
      .then(({ _id }) => Model.deleteOne({ _id }))
      .then(() => res.json({ messsage: 'OK' }))
      .catch(() => res.status(404).json({ message: 'Not found' }));
  });
};
