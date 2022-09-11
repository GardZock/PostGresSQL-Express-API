import { App } from './App';

export enum methods {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

interface Options {
    name: string;
    method: methods;
}

export class Route {
    
    options: Options;
    app: App;
    
    constructor(app: App, options: Options) {
        this.app = app;
        this.options = options;
    }
}