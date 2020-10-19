const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN, DATE, FLOAT, Model
} = Sequelize;
const sequelize = require('../common/database');

const Staff = require('./Staff')
const Merchant = require('./Merchant')

class Promotion extends Model {
}

Promotion.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    promoCode: {
      type: STRING,
      allowNull: false
    },
    startDate: {
      type: DATE,
      allowNull: false
    },
    endDate: {
      type: DATE,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    termsAndConditions: {
      type: STRING,
      allowNull: true
    },
    percentageDiscount: {
      type: FLOAT,
      allowNull: true
    },
    flatDiscount: {
      type: FLOAT,
      allowNull: true
    },
    usageLimit: {
      type: INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    usageCount: {
      type: INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    promotionTypeEnum: {
      type: STRING,
      allowNull: false
    },
    minimumSpend: {
      type: FLOAT,
      allowNull: true,
      validate: {
        min: 0
      },
      defaultValue: 0
    },
    expired: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
  sequelize,
  modelName: 'promotion',
  underscored: true
  }
);
    
Promotion.belongsTo(Staff);
Staff.hasMany(Promotion);

Promotion.belongsTo(Merchant);
Merchant.belongsTo(Staff);

module.exports = Promotion;