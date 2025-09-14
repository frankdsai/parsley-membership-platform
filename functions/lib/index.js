"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocument = void 0;
const app_1 = require("firebase-admin/app");
const documentProcessor_1 = require("./documentProcessor");
Object.defineProperty(exports, "processDocument", { enumerable: true, get: function () { return documentProcessor_1.processDocument; } });
(0, app_1.initializeApp)();
//# sourceMappingURL=index.js.map