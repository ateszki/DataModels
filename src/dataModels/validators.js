const Ajv = require('ajv');

const { renameTransformSchema, renameSchema } = require('./schemas/rename.schema');

const ajv = new Ajv();

const validateRenameTransform = ajv.compile(renameTransformSchema);
const validateRename = ajv.compile(renameSchema);

module.exports = {
  validateRename,
  validateRenameTransform,
};