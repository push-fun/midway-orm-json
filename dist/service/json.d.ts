import { Id } from '@push.fun/midway-tool';
export declare class Json {
    ctx: any;
    config: any;
    generateId: Id;
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
    Add(path: string, options: any): Promise<any>;
    Delete(path: string, options: any): Promise<any>;
    Update(path: string, options: any): Promise<any>;
    Get(path: string, options: {
        /**
         * type 查询类型
         * ```ts
         * type: 'all' // 查询全部条数
         * type: 'one' // 单条查询
         * type: 'page' // 分页查询
         * type: 'count' // 返回总条数
         * ```
         */
        type?: string;
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
        where?: Array<Object> | Object;
        order?: object;
    }): Promise<any>;
}
