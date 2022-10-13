const renameSchema = {
  type: "object",
  properties: {
    type: {type: "string", default: "rename"},
    rename: {
      type: "array",
      items: {
        type: "object", 
        properties: {
          column: {type: "string", default: ""},
          name: {type: "string", default: ""},
        },
        required:["column", "name"],
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};

module.exports = renameSchema;
