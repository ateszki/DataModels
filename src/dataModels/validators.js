const Ajv = require('ajv');

const renameSchema = require('./schemas/rename.schema');

const ajv = new Ajv({
  removeAdditional: 'all',
});

const validateRename = ajv.compile(renameSchema);

module.exports = {
  validateRename,
};