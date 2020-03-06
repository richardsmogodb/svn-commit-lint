"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var svn_1 = require("./svn");
var svn = new svn_1.Svn();
function run(options, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runWorker(options, logger)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    // if (error instanceof commandNotFound) {
                    //     logger.error(`${error.message}\n`);
                    //     return Status.commandNotFound;
                    // }
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
function runWorker(options, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, stdout, stderr;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, svn.status(options.path)];
                case 1:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    logger.log(stdout);
                    logger.log('---');
                    logger.log(stderr);
                    return [2 /*return*/, 0 /* OK */];
            }
        });
    });
}
