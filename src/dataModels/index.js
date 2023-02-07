const _ = require('lodash');

const { BaseModel } = require('./Base.model');
const { validateRename } = require('./validators');

// new Rename({
//   rename: [
//     { column: 'hi', name: '' },
//   ],
// });

class Rename extends BaseModel {
  static _validator = validateRename;
  static _defaults = {
    rename: [],
  };

  // this overrides the base model constructor so we can load our custom child model
  constructor(...args) {
    super(...args);

    this._init();
  }

  get rename() {
    return this._data.rename;
  }

  checkIsValid(strict = true) {
    if (_.isEmpty(this._data.rename)) {
      throw new Error('Must define at least one rename');
    }

    if (strict) {
      _.forEach(this._data.rename, (r, i) => {
        if (_.isEmpty(r.column) || _.isEmpty(r.name)) {
          throw new Error(`rename[${i}] column or name is missing`);
        }
      });
    }
  }

  // Model methods
  addRename(newRename = {}) {
    const transform = _.cloneDeep(this._data);
    transform.rename.push(newRename);
    this._validate(transform);

    // TODO: determine what to return
    return newRename._snapshot;
  }

  removeEmptyRenames(columnList = null) {
    const transform = _.cloneDeep(this._data);
    transform.rename = _.filter(transform.rename, ({ column, name }) => (
      name
      && (
        _.isNil(columnList)
       || _.includes(columnList, column)
      )
    ));
    this._validate(transform);
  }

  removeRename(rename) {
    const renameIndex = this.getIndex(rename);
    const transform = _.cloneDeep(this._data);
    _.pullAt(transform.rename, renameIndex);
    this._validate(transform);
  }

  setColumn(rename, column) {
    const renameIndex = this.getIndex(rename);
    const transform = _.cloneDeep(this._data);
    transform.rename[renameIndex].column = column;
    this._validate(transform);
  }

  removeRenameByIndex(index) {
    if (!this._data.rename[index]) {
      throw new Error('invalid index provided');
    }

    const transform = _.cloneDeep(this._data);
    _.pullAt(transform.rename, [index]);
    this._validate(transform);
  }

  setRename(rename) {
    const transform = _.cloneDeep(this._data);
    transform.rename = rename;
    this._validate(transform);
  }

  setRenameByColumn(column, name) {
    // add or update rename item without needing to know the indexes or whatever. Assumes all columns are unique.
    const colIdx = _.findIndex(this._data.rename, { column });

    if (colIdx === -1) {
      this.addRename({ column, name });
    } else {
      const transform = _.cloneDeep(this._data);
      transform.rename[colIdx].name = name;
      this._validate(transform);
    }
  }

  setRenameByIndex(index, name) {
    if (!this._data.rename[index]) {
      throw new Error('invalid index provided');
    }
    const transform = _.cloneDeep(this._data);
    transform.rename[index].name = name;
    this._validate(transform);
  }

  validateColumnNames(columnList) {
    // TODO: should this live here? Think about this more
    // maybe for v1 we just keep the validation in each individual transform, but we could abstract later
    // loop through renames and validate each column name exists in the column list
  }
}

module.exports = Rename;