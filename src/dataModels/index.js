const _ = require('lodash');

const { BaseModel } = require('./Base.model');
const { validateRename } = require('./validators');

// new Rename({
//   rename: [
//     { column: 'hi', name: '' },
//   ],
// });

class Rename extends BaseModel {
  _validator = validateRename;
  _defaults = {
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

  // TODO: update the below commented methods to follow the same validation pattern as addRename
  // TODO: add/update all the tests

  // removeDuplicates() {
  //   _.forEachRight(this.rename, (rename, idx) => {
  //     // remove it if there isn't a name defined
  //     let removeIt = !rename.name;

  //     // remove it if there is a duplicate name
  //     if (!removeIt) {
  //       const firstNameMatchIdx = _.findIndex(this.rename, { name: rename.name });
  //       removeIt = firstNameMatchIdx !== idx;
  //     }

  //     // remove it if duplicate entries for columns
  //     if (!removeIt) {
  //       const firstNameMatchIdx = _.findIndex(this.rename, { column: rename.column });
  //       removeIt = firstNameMatchIdx !== idx;
  //     }

  //     if (removeIt) {
  //       this.removeRename(rename);
  //     }
  //   });
  //   this._validate();
  // }

  // removeEmptyRenames(columnList = null) {
  //   // cleanup any empty renames to keep things tidy. Destroy in reverse order to prevent index issues.
  //   // removes any items without a defined value or that aren't in the selected column list (if provided)
  //   _.forEachRight(this.rename, (rename) => {
  //     if (!rename.name || (!_.isNil(columnList) && !_.includes(columnList, rename.column))) {
  //       this.removeRename(rename);
  //     }
  //   });
  //   this._validate();
  // }

  // removeRename(rename) {
  //   if (_.isString(rename)) {
  //     rename = _.find(this.rename, { column: rename });
  //   }
  //   if (rename) {
  //     this.rename = _.filter(this.rename, (r) => rename !== r);
  //   }
  //   this._validate();
  // }

  removeRenameByIndex(index) {
    if (!this._data.rename[index]) {
      throw new Error('invalid index provided');
    }

    const transform = _.cloneDeep(this._data);
    _.pullAt(transform.rename, [index]);
    this._validate(transform);
  }

  // setRename(rename) {
  //   this.rename = rename;
  //   this._validate();
  // }

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