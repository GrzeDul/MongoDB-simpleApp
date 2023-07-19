const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if no "firstName" arg', () => {
    const emp = new Employee({ lastName: 'Doe', department: 'IT' });

    emp.validate((err) => {
      expect(err.errors.firstName).to.exist;
    });
  });

  it('should throw an error if no "lastName" arg', () => {
    const emp = new Employee({ firstName: 'John', department: 'IT' });

    emp.validate((err) => {
      expect(err.errors.lastName).to.exist;
    });
  });

  it('should throw an error if no "department" arg', () => {
    const emp = new Employee({ firstName: 'John', lastName: 'Doe' });

    emp.validate((err) => {
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName" is not a string', () => {
    const cases = [{}, []];
    for (let firstName of cases) {
      const emp = new Employee({
        firstName,
        lastName: 'Doe',
        department: 'IT',
      });

      emp.validate((err) => {
        expect(err.errors.firstName).to.exist;
      });
    }
  });

  it('should throw an error if "lastName" is not a string', () => {
    const cases = [{}, []];
    for (let lastName of cases) {
      const emp = new Employee({
        firstName: 'John',
        lastName,
        department: 'IT',
      });

      emp.validate((err) => {
        expect(err.errors.lastName).to.exist;
      });
    }
  });

  it('should throw an error if "department" is not a string', () => {
    const cases = [{}, []];
    for (let department of cases) {
      const emp = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department,
      });

      emp.validate((err) => {
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if args are correct', () => {
    const cases = [
      { firstName: 'John', lastName: 'Doe', department: 'IT' },
      { firstName: 'Adam', lastName: 'Kowalski', department: 'Management' },
    ];
    for (let empCase of cases) {
      const emp = new Employee(empCase);

      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});

after(() => {
  mongoose.models = {};
});
