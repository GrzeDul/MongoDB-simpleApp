const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Department = require('../department.model');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'lName1',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Employee #2',
        lastName: 'lName2',
        department: 'IT',
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const Employees = await Employee.find();
      const expectedLength = 2;
      expect(Employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Employee #1' });
      const expectedName = 'Employee #1';
      expect(employee.firstName).to.be.equal(expectedName);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'Employee #1',
        lastName: 'lName1',
        department: 'IT',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'lName1',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Employee #2',
        lastName: 'lName2',
        department: 'IT',
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
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'lName1',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Employee #2',
        lastName: 'lName2',
        department: 'IT',
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Employee #1' });
      const deletedEmployee = await Employee.findOne({
        firstName: 'Employee #1',
      });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Employee #1' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'Employee #1',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const Employees = await Employee.find();
      expect(Employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Populating reference data', () => {
    before(async () => {
      const testDepOne = new Department({
        name: 'TestDep',
      });
      await testDepOne.save();
      const depID = testDepOne._id.toString();
      const testEmpOne = new Employee({
        firstName: 'Employee #1',
        lastName: 'lName1',
        department: depID,
      });
      await testEmpOne.save();
    });
    it('should properly populate department data with "populate" method', async () => {
      const employees = await Employee.find().populate('department');
      expect(employees[0].department.name).to.not.be.null;
    });
    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
});
