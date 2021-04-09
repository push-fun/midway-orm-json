"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONConfiguration = void 0;
const decorator_1 = require("@midwayjs/decorator");
const path_1 = require("path");
const tool = require("@push.fun/midway-tool");
let JSONConfiguration = class JSONConfiguration {
    async onReady(content) {
    }
};
__decorate([
    decorator_1.App(),
    __metadata("design:type", Object)
], JSONConfiguration.prototype, "app", void 0);
__decorate([
    decorator_1.Config(decorator_1.ALL),
    __metadata("design:type", Object)
], JSONConfiguration.prototype, "config", void 0);
JSONConfiguration = __decorate([
    decorator_1.Configuration({
        namespace: 'JSON',
        importConfigs: [
            path_1.join(__dirname, 'config')
        ],
        imports: [
            tool
        ]
    })
], JSONConfiguration);
exports.JSONConfiguration = JSONConfiguration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvUXVuL1VuY2x1dHRlci9taWR3YXktbGVybmEvcGFja2FnZXMvbWlkd2F5LW9ybS1qc29uL3NyYy8iLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQThFO0FBQzlFLCtCQUE0QjtBQUM1Qiw4Q0FBNkM7QUFXN0MsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFRMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUF5QjtJQUV2QyxDQUFDO0NBQ0osQ0FBQTtBQVJHO0lBREMsZUFBRyxFQUFFOzs4Q0FDaUI7QUFHdkI7SUFEQyxrQkFBTSxDQUFDLGVBQUcsQ0FBQzs7aURBQ0Q7QUFORixpQkFBaUI7SUFUN0IseUJBQWEsQ0FBQztRQUNYLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLGFBQWEsRUFBRTtZQUNYLFdBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO1NBQzVCO1FBQ0QsT0FBTyxFQUFFO1lBQ0wsSUFBSTtTQUNQO0tBQ0osQ0FBQztHQUNXLGlCQUFpQixDQVc3QjtBQVhZLDhDQUFpQiJ9