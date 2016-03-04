/* global module */

function User(user) {
    this.name = user.name;
    this.usename = user.usename;
    this.email = user.email;
    this.mobile = user.mobile;
    this.title = user.title;
}

module.exports = User;