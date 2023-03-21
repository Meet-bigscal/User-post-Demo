module.exports = {
  async up(db, client) {
    const roles = [
      {
        role: 'admin',
        __v : 0
      },
      {
        role: 'user',
        __v : 0
      },
      {
        role:'superadmin',
        __v : 0
      }
    ]
    await db.collection('roles').insertMany(roles)
  },

  async down(db, client) {
    await db.collection('roles').deleteOne({role:"superadmin"})
  }
};
