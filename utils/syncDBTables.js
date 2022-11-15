/* USE WITH CAUTION */
const Sequelize = require("../models");
const { models } = Sequelize.sequelize;

for (let model in models) {
  console.log(Sequelize[model]);
  Sequelize[model].sync({ alert: true });
}
