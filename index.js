const Ajv = require("ajv")
const ajv = new Ajv();
const { types } = require("mobx-state-tree")
const { maybeNull, frozen } = types

const RenameModel = require("./models/rename.model");
const renameSchema = require("./schemas/rename.schema");
const validateRenameSchema = ajv.compile(renameSchema);

const RenameMstModel =  types.model({
  object: maybeNull(frozen()),
})
.actions(self => ({
  setName(name, index) {
    self.object.setName(name, index);
  }
}))
.views(self => ({
  get rename() {
    return self.object.rename;
  },
  get isValid() {
    return self.object.isValid;
  },
  get data() {
    return self.object.data;
  }
}));

const renameModel =  RenameMstModel.create({ object: RenameModel});
console.log({renameModel});
console.log({id: renameModel.object.instanceId});
console.log({data: renameModel.object.data.rename, valid: renameModel.isValid, name: renameModel.rename});
renameModel.setName('andres', 0);
console.log({data: renameModel.object.data.rename, valid: renameModel.isValid, name: renameModel.rename});
const valid = validateRenameSchema(RenameMstModel.data);
if (!valid) console.log(validateRenameSchema.errors)
