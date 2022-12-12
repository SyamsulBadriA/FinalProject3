'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      full_name: "admin",
      email: "toko@admin.com",
      password: "$2a$10$284PIPCrPc2L6NmJmJ8.1OCIG1.owrvKC4q/n76sdeIqDu/VkN3pC",
      gender: "male",
      role: 0,
      balance: 75000000,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
