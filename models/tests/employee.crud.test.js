const mongoose = require('mongoose');
const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;

describe('Employee', () => {
  describe('Reading data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'Test',
        department: 'department',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Employee #2',
        lastName: 'Test',
        department: 'department',
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Employee #1' });
      expect(employee).to.not.be.null;
    });

    it('should populate related Department document', async () => {
      const dep = new Department({ name: 'testing' });
      await dep.save();

      const employee = new Employee({
        firstName: 'Employee #3',
        lastName: 'Test',
        department: dep._id,
      });
      await employee.save();

      await Employee.findOne({ firstName: 'Employee #3' })
        .then((emp) => emp.populate('department'))
        .then((emp) => expect(emp.department.name).to.exist);

      await Department.deleteMany();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should return all the data with "find" method', () => {
      it('should insert new document with "insertOne" method', async () => {
        const employee = new Employee({
          firstName: 'Employee #1',
          lastName: 'Test',
          department: 'department',
        });
        await employee.save();
        expect(employee.isNew).to.be.false;
      });

      after(async () => {
        await Employee.deleteMany();
      });
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'Test',
        department: 'department',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Employee #2',
        lastName: 'Test',
        department: 'department',
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'Employee #1' },
        { $set: { firstName: '=Employee #1=' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=Employee #1=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Employee #1' });
      employee.firstName = '=Employee #1=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=Employee #1=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'test' } });
      Employee.find().then((data) =>
        data.map((emp) => expect(emp.firstName).to.be.equal('test'))
      );
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'Test',
        department: 'department',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Employee #2',
        lastName: 'Test',
        department: 'department',
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne();
      Employee.find().then((data) => expect(data.length).to.be.equal(1));
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      Employee.find().then((data) => expect(data.length).to.be.equal(0));
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});
