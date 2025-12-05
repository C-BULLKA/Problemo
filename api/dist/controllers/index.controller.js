"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = __importDefault(require("path"));
var IndexController = /** @class */ (function () {
    function IndexController() {
        this.path = '/*';
        this.router = (0, express_1.Router)();
        this.serveIndex = function (request, response) {
            // Poprawka ścieżki jest tutaj
            response.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
        };
        this.initializeRoutes();
    }
    IndexController.prototype.initializeRoutes = function () {
        this.router.get(this.path, this.serveIndex);
    };
    return IndexController;
}());
exports.default = IndexController;
//# sourceMappingURL=index.controller.js.map