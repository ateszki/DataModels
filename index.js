const _ = require("lodash");
const Ajv = require("ajv")
const ajv = new Ajv();
const renameSchema = require("./schemas/rename.schema");
const validateRenameSchema = ajv.compile(renameSchema);

const Rename = {
  name: '',
  column: '',
} 

const RenameModel = {
  data: {
    type: "rename",
    rename: [{
      name: "",
      column: "bar",
    }],
  },
  validator: validateRenameSchema,
  addRename() {
    const newRename = Rename.create();
    self.rename.push(newRename);
    return newRename;
  },
  removeRename(rename) {
    if (_.isString(rename)) {
      rename = _.find(this.rename, { column: rename });
    }
    if (rename) {
      delete this.removeRename(rename);
    }
  },
  setColumn(column, index) {
    this.data.rename[index].column = column;
  },
  setName(name, index) {
    this.data.rename[index].name = name;
  },
  setRename(rename) {
    this.rename = rename;
  },
  setRenameColumn(column, value) {
    // add or update rename item without needing to know the indexes or whatever. Assumes all columns are unique.
    const colIdx = _.findIndex(this.rename, { column });
    let renameItem;
    if (colIdx === -1) {
      renameItem = self.addRename();
      renameItem.setColumn(column);
    } else {
      renameItem = this.rename[colIdx];
    }
    renameItem.setName(value);
  },
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
  },
  removeEmptyRenames(columnList = null) {
    // cleanup any empty renames to keep things tidy. Destroy in reverse order to prevent index issues.
    // removes any items without a defined value or that aren't in the selected column list (if provided)
    _.forEachRight(self.rename, (rename) => {
      if (!rename.name || (!_.isNil(columnList) && columnList.indexOf(rename.column) === -1)) {
        this.removeRename(rename);
      }
    });
  },
  removeRename(rename) {
    const newRename = _.filter(this.rename, r => r !== rename)
    this.setRename(newRename);
  },
  get isValid() { 
    return this.validator(this.data) && _.every(this.data.rename, r => !_.isEmpty(r.name) && !_.isEmpty(r.column));
  },
};

console.log({data: RenameModel.data.rename, valid: RenameModel.isValid});
const valid = validateRenameSchema(RenameModel.data);
if (!valid) console.log(validateRenameSchema.errors)
console.log(valid)
RenameModel.setName('andres', 0);
console.log({data: RenameModel.data.rename, valid: RenameModel.isValid});
const valid1 = validateRenameSchema(RenameModel.data);
if (!valid1) console.log(validateRenameSchema.errors)
console.log(valid1)