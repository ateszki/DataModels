const renameSchema = {
  type: "object",
  properties: {
    type: { const: "rename" },
    rename: {
      type: "array",
      items: {
        type: "object", 
        properties: {
          column: { type: "string" },
          name: { type: "string" },
        },
        required: ["column", "name"],
        additionalProperties: false,
      },
    },
  },
  required: ['type', 'rename'],
  additionalProperties: false,
};

module.exports = renameSchema;
