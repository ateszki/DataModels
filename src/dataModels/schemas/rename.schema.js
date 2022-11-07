const renameSchema = {
  type: 'object',
  properties: { // not requiring either of these so you can add an empty rename potentially
    column: { type: 'string' },
    name: { type: 'string' },
  },
  additionalProperties: false,
};

const renameTransformSchema = {
  type: 'object',
  required: ['type', 'rename'],
  properties: {
    type: { const: 'rename' },
    rename: {
      type: 'array',
      items: renameSchema,
    },
  },
  additionalProperties: false,
};

module.exports = {
  renameSchema,
  renameTransformSchema,
};