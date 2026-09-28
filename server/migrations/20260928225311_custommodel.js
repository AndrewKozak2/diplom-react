// Автозгенеровано skill db-migration з ER-опису колекції CustomModel.
// Міграція 20260928225311_custommodel
module.exports = {
  async up(db) {
  await db.collection("customModels").updateMany({ rimColor: { $exists: true } }, { $rename: { "rimColor": "wheelColor" } });
  await db.collection("customModels").updateMany({ isFeatured: { $exists: false } }, { $set: { "isFeatured": false } });
  },

  async down(db) {
  await db.collection("customModels").updateMany({ wheelColor: { $exists: true } }, { $rename: { "wheelColor": "rimColor" } });
  await db.collection("customModels").updateMany({}, { $unset: { "isFeatured": "" } });
  },
};
