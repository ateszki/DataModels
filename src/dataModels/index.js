const _ = require("lodash");
const Ajv = require("ajv")
const ajv = new Ajv();
const renameSchema = require("./schemas/rename.schema");
const validateRenameSchema = ajv.compile(renameSchema);

class RenameModel {
  constructor(data) {
    if (!data) {
      data = {
        type: 'rename',
        rename: [],
      };
    }
    this.data = this.validate(data);
  }

  validate(data) {
    const cloned = _.cloneDeep(data); // because validate might modify the objecg
    const isValid = validateRenameSchema(cloned);
    if (!isValid) {
      throw new Error(JSON.stringify(validateRenameSchema.errors));
    }
    return cloned;
  }

  addRename(newRename = {}) {
    this.rename.push(newRename);
  }

  removeRename(rename) {
    if (_.isString(rename)) {
      rename = _.find(this.rename, { column: rename });
    }
    if (rename) {
      delete this.removeRename(rename);
    }
  }

  setColumn(column, index) {
    if (column && !this.data.rename[index]) {
      this.data.rename[index] = {};
    }
    this.data.rename[index].column = column;
  }

  setName(name, index) {
    if (name && !this.data.rename[index]) {
      this.data.rename[index] = {};
    }
    this.data.rename[index].name = name;
  }

  setRename(rename) {
    this.rename = rename;
  }

  setRenameColumn(column, value) {
    // add or update rename item without needing to know the indexes or whatever. Assumes all columns are unique.
    const colIdx = _.findIndex(this.rename, { column });
    let renameItem;
    if (colIdx === -1) {
      renameItem = this.addRename();
      renameItem.setColumn(column);
    } else {
      renameItem = this.rename[colIdx];
    }
    renameItem.setName(value);
  }

  removeDuplicates() {
    _.forEachRight(this.rename, (rename, idx) => {
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
        this.removeRename(rename);
      }
    });
  }

  removeEmptyRenames(columnList = null) {
    // cleanup any empty renames to keep things tidy. Destroy in reverse order to prevent index issues.
    // removes any items without a defined value or that aren't in the selected column list (if provided)
    _.forEachRight(this.rename, (rename) => {
      if (!rename.name || (!_.isNil(columnList) && columnList.indexOf(rename.column) === -1)) {
        this.removeRename(rename);
      }
    });
  }

  removeRename(rename) {
    const newRename = _.filter(this.rename, r => r !== rename)
    this.setRename(newRename);
  }

  get rename() {
    return this.data.rename;
  }

  get isValid() { 
    return this.validate(this.data) && _.every(this.data.rename, r => !_.isEmpty(r.name) && !_.isEmpty(r.column));
  }
};

module.exports = RenameModel;

const emptyModel = new RenameModel();
console.log({data: emptyModel.data.rename, valid: emptyModel.isValid});

const modelInstance = new RenameModel({
  type: "rename",
  rename: [{
    name: "",
    column: "bar",
  }],
});
console.log({data: modelInstance.data.rename, valid: modelInstance.isValid});
//modelInstance.setName('andres', 0);
//console.log({data: modelInstance.data.rename, valid: modelInstance.isValid});