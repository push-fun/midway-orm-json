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
exports.Json = void 0;
const decorator_1 = require("@midwayjs/decorator");
const moment = require("moment");
const tutils_1 = require("tutils");
const midway_tool_1 = require("@push.fun/midway-tool");
const path_1 = require("path");
const fs = new tutils_1.FileSystem();
// 高并发写入记录器
let cacheNum = {};
let Json = class Json {
    /**
     * <添加方法>
     * @param path
     * @param options.data 【写入数据】
     * @example
     * ``` ts
     * const add = await this.json.Add('home', {
     *     data: {
     *         ame: 'lee'
     *     }
     * })
     * ------------------------
     * ```
     */
    async Add(path, options) {
        path = path_1.join(this.ctx.app.appDir, `/jsondb/${path}.jsondb`);
        // 数组
        let isArray = options.data && this.ctx.is.Array(options.data);
        // 对象
        let isObject = options.data && this.ctx.is.Object(options.data);
        let data = [];
        let rets = [];
        if (isArray) {
            let list = options.data;
            for (let i = 0, length = list.length; i < length; i++) {
                let id = this.generateId.ID ? this.generateId.ID : this.generateId.SetUUID();
                // 整理数据
                let obj = {
                    id: list[i].id ? undefined : id,
                    ...list[i],
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                };
                // 存储数据
                data.push(obj);
                rets.push(obj);
            }
        }
        if (isObject) {
            let id = this.generateId.ID ? this.generateId.ID : this.generateId.SetUUID();
            // 整理数据
            let obj = {
                id: options.data.id ? undefined : id,
                ...options.data,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            // 存储数据
            data.push(obj);
            rets.push(obj);
        }
        let str = JSON.stringify(data);
        // 获取文件内容
        const getData = await fs.readText(path, false);
        // 定义写入
        let execAdd = null;
        // 无此文件
        if (getData === null && typeof getData === 'object') {
            str = str.substr(1, str.length - 2);
            // 写入&创建
            execAdd = await fs.writeFile(path, str);
        }
        // 有此文件
        if (getData && getData !== '' && typeof getData === 'string') {
            str = str.substr(1, str.length);
            str = `,${str.substr(0, str.length - 1)}`;
            // 追加写入
            execAdd = await fs.appendFile(path, str);
        }
        if (getData === '' && typeof getData === 'string') {
            if (cacheNum[path]) {
                str = str.substr(1, str.length);
                str = `,${str.substr(0, str.length - 1)}`;
            }
            else {
                str = str.substr(1, str.length - 2);
            }
            cacheNum[path] = cacheNum[path] ? Number(cacheNum[path]) + 1 : 1;
            // 追加写入
            execAdd = await fs.appendFile(path, str);
        }
        if (execAdd || execAdd === undefined) {
            return rets;
        }
        else {
            return false;
        }
    }
    async Delete(path, options) {
        path = path_1.join(this.ctx.app.appDir, `/jsondb/${path}.jsondb`);
        let where = options.where;
        // 数组
        let isArray = where && this.ctx.is.Array(where);
        // 对象
        let isObject = where && this.ctx.is.Object(where);
        let data = [];
        let result = [];
        let delArr = [];
        // 获取文件内容
        const getData = await fs.readText(path, false);
        // 如果有内容时
        if (getData && getData !== '')
            data = JSON.parse(`[${getData}]`);
        if (where) {
            // 对象And查询
            if (isObject) {
                for (let key in where) {
                    if (midway_tool_1.is.Number(where[key]))
                        where[key] = where[key] + '';
                }
                result = await this.ctx.arrFind(data, where);
            }
            // 数组Or查询
            let arrWhere = where;
            if (isArray)
                for (let i = 0, len = arrWhere.length; i < len; i++) {
                    for (let key in where[i]) {
                        if (midway_tool_1.is.Number(where[i][key]))
                            where[i][key] = where[i][key] + '';
                    }
                    result.push.apply(result, await this.ctx.arrFind(data, where[i]));
                }
        }
        else {
            result = data;
        }
        // 删除顺序
        let order = options.order;
        if (order) {
            let length = Object.keys(order).length;
            if (length) {
                for (let key in order) {
                    if (order[key] === 'ASC') {
                        result = this.ctx.ArrayRankObj(result, key);
                    }
                    if (order[key] === 'DESC') {
                        result = this.ctx.ArrayRankObj(result, key, false);
                    }
                }
            }
        }
        // TODO: 默认多条删除，后期追加单条删除和多条删除
        for (let i = 0, len = result.length; i < len; i++) {
            let index = await midway_tool_1.array.arrIndex(data, 'id', result[i].id);
            data.splice(index, 1);
        }
        // 写入
        let str = JSON.stringify(data);
        str = str.substr(1, str.length - 2);
        const execAdd = await fs.writeFile(path, str);
        if (execAdd || execAdd === undefined) {
            return {
                code: 2000,
                message: '删除成功！'
            };
        }
        else {
            return false;
        }
    }
    async Update(path, options) {
        let where = options.where;
        // 数组
        let isArray = where && this.ctx.is.Array(where);
        // 对象
        let isObject = where && this.ctx.is.Object(where);
        let data = [];
        let result = [];
        // 获取文件内容
        const getData = await fs.readText(path, false);
        // 如果有内容时
        if (getData && getData !== '')
            data = JSON.parse(getData);
    }
    async Get(path, options) {
        path = path_1.join(this.ctx.app.appDir, `/jsondb/${path}.jsondb`);
        let where = options.where;
        // 数组
        let isArray = where && this.ctx.is.Array(where);
        // 对象
        let isObject = where && this.ctx.is.Object(where);
        let data = [];
        let result = [];
        // 获取文件内容
        const getData = await fs.readText(path, false);
        // 如果有内容时
        if (getData && getData !== '')
            data = JSON.parse(`[${getData}]`);
        if (where) {
            // 对象And查询
            if (isObject) {
                for (let key in where) {
                    if (midway_tool_1.is.Number(where[key]))
                        where[key] = where[key] + '';
                }
                result = await this.ctx.arrFind(data, where);
            }
            // 数组Or查询
            let arrWhere = where;
            if (isArray)
                for (let i = 0, len = arrWhere.length; i < len; i++) {
                    for (let key in where[i]) {
                        if (midway_tool_1.is.Number(where[i][key]))
                            where[i][key] = where[i][key] + '';
                    }
                    result.push.apply(result, await this.ctx.arrFind(data, where[i]));
                }
        }
        else {
            result = data;
        }
        // 排序
        let order = options.order;
        if (order) {
            let length = Object.keys(order).length;
            if (length) {
                for (let key in order) {
                    if (order[key] === 'ASC') {
                        result = this.ctx.ArrayRankObj(result, key);
                    }
                    if (order[key] === 'DESC') {
                        result = this.ctx.ArrayRankObj(result, key, false);
                    }
                }
            }
        }
        return result;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], Json.prototype, "ctx", void 0);
__decorate([
    decorator_1.Config(decorator_1.ALL),
    __metadata("design:type", Object)
], Json.prototype, "config", void 0);
__decorate([
    decorator_1.Inject('TOOL:id'),
    __metadata("design:type", midway_tool_1.Id
    /**
     * <添加方法>
     * @param path
     * @param options.data 【写入数据】
     * @example
     * ``` ts
     * const add = await this.json.Add('home', {
     *     data: {
     *         ame: 'lee'
     *     }
     * })
     * ------------------------
     * ```
     */
    )
], Json.prototype, "generateId", void 0);
Json = __decorate([
    decorator_1.Provide()
], Json);
exports.Json = Json;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvUXVuL1VuY2x1dHRlci9taWR3YXktbGVybmEvcGFja2FnZXMvbWlkd2F5LW9ybS1qc29uL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZpY2UvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtREFBbUU7QUFDbkUsaUNBQWdDO0FBQ2hDLG1DQUFtQztBQUNuQyx1REFBNkQ7QUFDN0QsK0JBQTJCO0FBRTNCLE1BQU0sRUFBRSxHQUFHLElBQUksbUJBQVUsRUFBRSxDQUFBO0FBQzNCLFdBQVc7QUFDWCxJQUFJLFFBQVEsR0FBUSxFQUFFLENBQUE7QUFHdEIsSUFBYSxJQUFJLEdBQWpCLE1BQWEsSUFBSTtJQVdiOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLElBQVksRUFBRSxPQUFZO1FBRWhDLElBQUksR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsSUFBSSxTQUFTLENBQUMsQ0FBQTtRQUUxRCxLQUFLO1FBQ0wsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdELEtBQUs7UUFDTCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFL0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2IsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBRWIsSUFBRyxPQUFPLEVBQUU7WUFDUixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFBO1lBQ3ZCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0s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