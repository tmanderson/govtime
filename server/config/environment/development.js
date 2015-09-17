'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://heroku_tj3f1v47:vj4getrobgal4f7tv6j2bi5u6g@ds033143.mongolab.com:33143/heroku_tj3f1v47'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },

  seedDB: false
};
