export interface OrmOptions {
    /**
     * @param type 查询类型 one[单条] all[全部] page[分页] count[查询数量] default[默认全部]
     */
    type?: string;
    /**
     * @param where 查询条件 { id: xxx }
     */
    where?: object;
}
