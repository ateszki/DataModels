const _ = require('lodash');

const { BaseModel } = require('./Base.model');
const { validateRenameTransform } = require('./validators');

class Rename extends BaseModel {
  static _validator = validateRenameTransform;
  static _defaults = {
    type: 'rename',
    rename: [],
  };

  // Getters
  get rename() {
    return this._data.rename;
  }

  get type() {
    return this._data.type;
  }

  // Validation Methods
  checkIsValid() {
    if (_.isEmpty(this.rename)) {
      throw new Error('Must define at least one rename');
    }

    const hasIncompleteRenames = _.some(this.rename, ({ column, name }) => (!_.trim(column) || !_.trim(name)));
    if (hasIncompleteRenames) {
      throw new Error('Each rename must have valid "column" and "name"');
    }
  }

  // Model methods
  addRename(data = {}) {
    const newRename = _.defaults(data, {
      column: '',
      name: '',
    });
    
    this._data.rename.push(newRename);
    return _.last(this.rename);
  }
  
  getRenameIndex(column) {
    return _.findIndex(this.rename, { column });
  }

  removeDuplicates() {
    _.forEachRight(this._data.rename, (rename, idx) => {
      // remove it if there isn't a name defined
      let removeIt = !rename.name;

      // remove it if there is a duplicate name
      if (!removeIt) {
        const firstNameMatchIdx = _.findIndex(this.rename, { name: rename.name });
        removeIt = firstNameMatchIdx !== idx;
      }

      // remove it if duplicate entries for columns
      if (!removeIt) {
        const firstNameMatchIdx = _.findIndex(this.rename, { column: rename.column });
        removeIt = firstNameMatchIdx !== idx;
      }
      
      if (removeIt) {
        this.removeRename(idx);
      }
    });
  }

  removeEmptyRenames(columnList = null) {
    this._data.rename = _.filter(this._data.rename, ({ column, name }) => (
      name
      && (
        _.isNil(columnList)
       || _.includes(columnList, column)
      )
    ));
  }

  removeRename(index) {
    this._data.rename = _.filter(this._data.rename, (_r, i) => i !== index);
  }

  setColumn(column, index) {
    console.log(this._data)
    this._data.rename[index].column = column;
  }

  setName(name, index) {
    this._data.rename[index].name = name;
  }

  setRename(rename) {
    this._data.rename = rename;
  }

  setRenameColumn(column, value) {
    // add or update rename item without needing to know the indexes or whatever. Assumes all columns are unique.
    let renameIndex = this.getRenameIndex(column);

    if (renameIndex === -1) {
      this.addRename();
      renameIndex = _.size(this.rename) - 1;
      this.setColumn(column, renameIndex);
    }

    this.setName(value, renameIndex);
  }

  validateColumnNames(columnList) {
    // TODO: should this live here? Think about this more
    // maybe for v1 we just keep the validation in each individual transform, but we could abstract later
    // loop through renames and validate each column name exists in the column list
    return columnList;
  }
}

module.exports = { Rename };