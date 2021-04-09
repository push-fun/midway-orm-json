import { ILifeCycle, IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
import { Config, Configuration, ALL, Inject, App } from '@midwayjs/decorator';
import { join } from 'path';
import * as tool from '@push.fun/midway-tool'

@Configuration({
    namespace: 'JSON',
    importConfigs: [
        join(__dirname, 'config')
    ],
    imports: [
        tool
    ]
})
export class JSONConfiguration implements ILifeCycle {

    @App()
    app: IMidwayApplication

    @Config(ALL)
    config: any
    
    async onReady(content: IMidwayContainer) {

    }
}