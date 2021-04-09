import { Provide, Config, ALL, Inject } from '@midwayjs/decorator';
import * as moment from 'moment'
import { FileSystem } from 'tutils'
import { array, Id, is, number } from '@push.fun/midway-tool'
import { join } from 'path'

const fs = new FileSystem()
// 高并发写入记录器
let cacheNum: any = {}

@Provide()
export class Json {

    @Inject()
    ctx: any

    @Config(ALL)
    config: any

    @Inject('TOOL:id')
    generateId: Id

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
    async Add(path: string, options: any): Promise<any> {
        
        path = join(this.ctx.app.appDir, `/jsondb/${path}.jsondb`)

        // 数组
        let isArray = options.data && this.ctx.is.Array(options.data)
        // 对象
        let isObject = options.data && this.ctx.is.Object(options.data)

        let data = []
        let rets = []

        if(isArray) {
            let list = options.data
            for(let i = 0, length = list.length; i < length; i++) {
                let id = this.generateId.ID ? this.generateId.ID : this.generateId.SetUUID()
                // 整理数据
                let obj = {
                    id: list[i].id ? undefined : id,
                    ...list[i],
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                // 存储数据
                data.push(obj)
                rets.push(obj)
            }
        }

        if(isObject) {
            let id = this.generateId.ID ? this.generateId.ID : this.generateId.SetUUID()
            // 整理数据
            let obj = {
                id: options.data.id ? undefined : id,
                ...options.data,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            // 存储数据
            data.push(obj)
            rets.push(obj)
        }
        let str = JSON.stringify(data)

        // 获取文件内容
        const getData = await fs.readText(path, false)
        // 定义写入
        let execAdd: any = null
        // 无此文件
        if(getData === null && typeof getData === 'object') {
            str = str.substr(1, str.length - 2)
            // 写入&创建
            execAdd = await fs.writeFile(path, str)
        }
        // 有此文件
        if(getData && getData !== '' && typeof getData === 'string') {
            str = str.substr(1, str.length)
            str = `,${str.substr(0, str.length - 1)}`
            // 追加写入
            execAdd = await fs.appendFile(path, str)
        }

        if(getData === '' && typeof getData === 'string') {
            if(cacheNum[path]) {
                str = str.substr(1, str.length)
                str = `,${str.substr(0, str.length - 1)}`
            } else {
                str = str.substr(1, str.length - 2)
            }
            cacheNum[path] = cacheNum[path] ? Number(cacheNum[path]) + 1 : 1
            // 追加写入
            execAdd = await fs.appendFile(path, str)
        }

        if(execAdd || execAdd === undefined) {
            return rets
        } else {
            return false
        }
    }
    
    async Delete(path: string, options: any): Promise<any> {

        path = join(this.ctx.app.appDir, `/jsondb/${path}.jsondb`)

        let where = options.where
        // 数组
        let isArray = where && this.ctx.is.Array(where)
        // 对象
        let isObject = where && this.ctx.is.Object(where)

        let data = []
        let result = []
        let delArr = []
        // 获取文件内容
        const getData = await fs.readText(path, false)
        // 如果有内容时
        if(getData && getData !== '') data = JSON.parse(`[${getData}]`)

        if(where) {
            // 对象And查询
            if(isObject) {
                for(let key in where) {
                    if(is.Number(where[key])) where[key] = where[key] + ''
                }
                result = await this.ctx.arrFind(data, where)
            }

            // 数组Or查询
            let arrWhere: any = where
            if(isArray) for(let i = 0, len = arrWhere.length; i < len; i++) {
                for(let key in where[i]) {
                    if(is.Number(where[i][key])) where[i][key] = where[i][key] + ''
                }
                result.push.apply(result, await this.ctx.arrFind(data, where[i]))
            }
        } else {
            result = data
        }

        // 删除顺序
        let order = options.order
        if(order) {
            let length = Object.keys(order).length
            if(length) {
                for(let key in order) {
                    if(order[key] === 'ASC') {
                        result = this.ctx.ArrayRankObj(result, key)
                    }
                    if(order[key] === 'DESC') {
                        result = this.ctx.ArrayRankObj(result, key, false)
                    }
                }
            }
        }

        // TODO: 默认多条删除，后期追加单条删除和多条删除
        for(let i = 0, len = result.length; i < len; i++) {
            let index = await array.arrIndex(data, 'id', result[i].id)
            data.splice(index, 1)
        }

        // 写入
        let str = JSON.stringify(data)
        str = str.substr(1, str.length - 2)
        const execAdd: any = await fs.writeFile(path, str)

        if(execAdd || execAdd === undefined) {
            return {
                code: 2000,
                message: '删除成功！'
            }
        } else {
            return false
        }
    }

    async Update(path: string, options: any): Promise<any> {
        let where = options.where
        // 数组
        let isArray = where && this.ctx.is.Array(where)
        // 对象
        let isObject = where && this.ctx.is.Object(where)

        let data = []
        let result = []
        // 获取文件内容
        const getData = await fs.readText(path, false)
        // 如果有内容时
        if(getData && getData !== '') data = JSON.parse(getData)

        
    }

    async Get(path: string, options: {
        /**
         * type 查询类型
         * ```ts
         * type: 'all' // 查询全部条数
         * type: 'one' // 单条查询
         * type: 'page' // 分页查询
         * type: 'count' // 返回总条数
         * ```
         */
        type?: string,
        /**
         * where 查询条件 [数组或对象]
         * ```ts
         * // Object
         * where: { name: 'lee' } // 查询name为lee的数据
         * // Array
         * where: [ // 数组内对象之间为 OR 关系
         * { name: 'lee' }, // 查询name为lee或者为me的数据
         * { name: 'me' } 
         * ]
         * ```
         */
        where?: Array<Object> | Object,
        order?: object
    }): Promise<any> {

        path = join(this.ctx.app.appDir, `/jsondb/${path}.jsondb`)

        let where = options.where
        // 数组
        let isArray = where && this.ctx.is.Array(where)
        // 对象
        let isObject = where && this.ctx.is.Object(where)

        let data = []
        let result = []
        // 获取文件内容
        const getData = await fs.readText(path, false)
        // 如果有内容时
        if(getData && getData !== '') data = JSON.parse(`[${getData}]`)

        if(where) {
            // 对象And查询
            if(isObject) {
                for(let key in where) {
                    if(is.Number(where[key])) where[key] = where[key] + ''
                }
                result = await this.ctx.arrFind(data, where)
            }

            // 数组Or查询
            let arrWhere: any = where
            if(isArray) for(let i = 0, len = arrWhere.length; i < len; i++) {
                for(let key in where[i]) {
                    if(is.Number(where[i][key])) where[i][key] = where[i][key] + ''
                }
                result.push.apply(result, await this.ctx.arrFind(data, where[i]))
            }
        } else {
            result = data
        }

        // 排序
        let order = options.order
        if(order) {
            let length = Object.keys(order).length
            if(length) {
                for(let key in order) {
                    if(order[key] === 'ASC') {
                        result = this.ctx.ArrayRankObj(result, key)
                    }
                    if(order[key] === 'DESC') {
                        result = this.ctx.ArrayRankObj(result, key, false)
                    }
                }
            }
        }

        return result
    }
}