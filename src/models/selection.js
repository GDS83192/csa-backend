const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Selection', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
