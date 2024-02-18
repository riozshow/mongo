const mongoose = require('mongoose');
const Employee = require('../employee.model.js');
const expect = require('chai').expect;

it('should throw an error if has lack of required args', (Model = Employee) => {
  const correctInput = Object.fromEntries(
    Object.keys(Model.schema.paths)
      .filter((key) => Model.schema.paths[key].isRequired)
      .map((key) => [key, 'test_value'])
  );

  new Array(50)
    .fill(1)
    .map(() => ({ ...correctInput }))
    .map((test) => {
      let removed;
      let randoms = Object.keys(correctInput).length;
      while (randoms || !removed) {
        const key =
          Object.keys(test)[
            Math.floor(Math.random() * Object.keys(correctInput).length)
          ];
        if (test[key]) {
          delete test[key];
          removed = true;
        }
        --randoms;
      }
      return test;
    })
    .map((test) => {
      const model = new Model(test);
      const err = model.validateSync();

      Object.keys(correctInput)
        .filter((field) => !Object.keys(test).includes(field))
        .map((missedField) => {
          expect(err.errors[missedField]).to.exist;
        });
    });
});

it('should throw an error if any of args has a wrong type or is undefined', (Model = Employee) => {
  const types = {
    null: null,
    undefined: undefined,
    string: 'test_value',
    number: 4324,
    object: {},
  };

  const cases = [];

  const paths = Object.keys(Model.schema.paths)
    .filter((key) => !key.includes('_'))
    .map((key) => ({ [key]: typeof Model.schema.paths[key].options.type() }));

  paths.map((path) => {
    const [[pathKey, requiredType]] = Object.entries(path);
    let wrongTypes = Object.keys(types).filter((type) => type !== requiredType);

    if (requiredType === 'string') {
      wrongTypes = wrongTypes.filter((type) => type !== 'number');
    }

    const otherKeys = Object.fromEntries(
      paths
        .filter((p) => p !== path)
        .map((path) => {
          const [[otherKey, requiredType]] = Object.entries(path);
          return [[otherKey], types[requiredType]];
        })
    );

    wrongTypes.map((wrongType) => {
      cases.push({
        [pathKey]: types[wrongType],
        ...otherKeys,
        testedField: pathKey,
      });
    });
  });

  cases.map((test) => {
    const testedField = test.testedField;
    delete test.testedField;
    const model = new Model(test);
    const err = model.validateSync();
    expect(err.errors[testedField]).to.exist;
  });
});

it('should not throw an error if all of args are correct', (Model = Employee) => {
  const types = {
    null: [null],
    undefined: [undefined],
    string: ['test_value', 'dsadads', 432432423, 'c'],
    number: [4324, 32, 3243, 1],
    object: [{}],
  };

  const cases = [];

  const paths = Object.keys(Model.schema.paths)
    .filter((key) => !key.includes('_'))
    .map((key) => ({ [key]: typeof Model.schema.paths[key].options.type() }));

  paths.map((path) => {
    const [[pathKey, requiredType]] = Object.entries(path);

    types[requiredType].map((value) => {
      const otherPaths = Object.fromEntries(
        paths
          .filter((p) => p !== path)
          .map((path) => {
            const [[otherKey, requiredType]] = Object.entries(path);
            return [
              otherKey,
              types[requiredType][
                Math.floor(Math.random() * types[requiredType].length)
              ],
            ];
          })
      );
      cases.push({
        [pathKey]: value,
        ...otherPaths,
      });
    });
  });

  cases.map((test) => {
    const model = new Model(test);
    const err = model.validateSync();
    expect(err).not.to.exist;
  });
});

after(() => {
  mongoose.models = {};
});
