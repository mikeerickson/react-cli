/* global module */

/**
 * @param {type} user
 * @returns {nm$_user.User}
 */
function User(user) {
    this.name = user.name;
    this.usename = user.usename;
    this.password = user.password;
    this.email = user.email;
    this.mobile = user.mobile;
    this.sex = user.sex;
    this.mobile = user.mobile;
    this.age = user.age;
    this.desc = user.desc;
}

module.exports = User;