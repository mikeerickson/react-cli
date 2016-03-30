/* global module */

function Json(json) {
    this.ok = json.ok;
    this.code = json.code;
    this.data = json.data;
    this.msg = json.msg;
    this.error = json.error;
    this.ext = json.ext;
}

module.exports = Json;