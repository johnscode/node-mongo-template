
const logger = require('../logger');
const User = require('../models/usermongo');
const initialDb = require('./initialDb');

const initUsersFunc = async function() {
  await Promise.all(initialDb.initialUsers().map(async function (u) {
    logger.info(`user ${JSON.stringify(u)}`);
    initialDb.userDict[u.username]=u;
    await u.save();
    return u;
  }));
};

module.exports.setupTestUsers = initUsersFunc;

const deleteUsersFunc = async function() {
  initialDb.userDict={}
  await User.deleteMany({})
}
module.exports.clearTestUsers = deleteUsersFunc;

module.exports.clearDb = async () => {
  await deleteUsersFunc();
}
module.exports.setupDb = async () => {
  return await initUsersFunc();
}
module.exports.resetDb = async () => {
  await deleteUsersFunc();
  await initUsersFunc();
}