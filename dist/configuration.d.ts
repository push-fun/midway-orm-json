import { ILifeCycle, IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
export declare class JSONConfiguration implements ILifeCycle {
    app: IMidwayApplication;
    config: any;
    onReady(content: IMidwayContainer): Promise<void>;
}
