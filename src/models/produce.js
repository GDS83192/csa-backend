const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Produce', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
