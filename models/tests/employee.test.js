const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if there is no arg', () => {
    const cases = [
      { arg: 'firstName', obj: { lastName: 'Doe', department: 'IT' } },
      { arg: 'lastName', obj: { firstName: 'John', department: 'IT' } },
      { arg: 'department', obj: { firstName: 'John', lastName: 'Doe' } },
    ];

    for (let empCase of cases) {
      const emp = new Employee(empCase.obj);

      emp.validate((err) => {
        expect(err.errors[empCase.arg]).to.exist;
      });
    }
  });

  it('should throw an error if arg is not a string', () => {
    const cases = [
      { arg: 'firstName', obj: { lastName: 'Doe', department: 'IT' } },
      { arg: 'lastName', obj: { firstName: 'John', department: 'IT' } },
      { arg: 'department', obj: { firstName: 'John', lastName: 'Doe' } },
    ];

    const wrongArgs = [{}, []];

    for (let empCase of cases) {
      for (let wrongArg of wrongArgs) {
        const {
          firstName = wrongArg,
          lastName = wrongArg,
          department = wrongArg,
        } = empCase.obj;
        const emp = new Employee({
          firstName,
          lastName,
          department,
        });

        emp.validate((err) => {
          expect(err.errors[empCase.arg]).to.exist;
        });
      }
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
