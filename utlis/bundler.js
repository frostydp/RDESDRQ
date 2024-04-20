export const updateCustomDataFields = (newData, body, fieldNames) => {
  fieldNames.forEach((field) => {
    if (body[field] !== undefined) {
      newData[field] = body[field];
    }
  });
};
