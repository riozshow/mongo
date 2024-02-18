const mongoose = require('mongoose');
const Department = require('../department.model.js');
const expect = require('chai').expect;

it('should throw an error if no "name" arg', () => {
  const dep = new Department({});
  const err = dep.validateSync();
  expect(err.errors.name).to.exist;
});

it('should throw an error if no "name" is not a string', () => {
  const cases = [
    [],
    {},
    // to przyjmuje :D () => {},
    () => {
      return;
    },
  ];

  for (let name of cases) {
    const dep = new Department({ name });
    const err = dep.validateSync();
    expect(err.errors.name).to.exist;
  }
});

it('should throw an error if no "name" is too long or too short', () => {
  const cases = [
    '3213',
    'fds',
    '1e',
    '4324324234234234234234324324324',
    'fdgdfgdfgdfgdfgdfgdfgdfgdfg',
    3434,
    34,
    432423423423423423423423432,
  ];

  for (let name of cases) {
    const dep = new Department({ name });
    const err = dep.validateSync();
    expect(err.errors.name).to.exist;
  }
});

it('should work properly if "name" arg is correct', () => {
  const cases = ['dsadasdasd', 43243223423, '#e32d2d32d', 'dSA878dsa'];

  for (let name of cases) {
    const dep = new Department({ name });
    const err = dep.validateSync();
    expect(err).to.not.exist;
  }
});

after(() => {
  mongoose.models = {};
});
