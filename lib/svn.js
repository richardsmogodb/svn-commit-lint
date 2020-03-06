"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process = require("child_process");
var util = require("util");
var Svn = /** @class */ (function () {
    function Svn() {
        this.name = "svn";
    }
    Svn.prototype.status = function (path) {
        var execSync = util.promisify(child_process.exec);
        var execPath = path === undefined ? "" : path;
        return execSync(this.name + " st " + execPath);
    };
    return Svn;
}());
exports.Svn = Svn;
