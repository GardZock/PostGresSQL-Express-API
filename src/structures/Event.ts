import { App } from "./App";

interface Options {
    name: string;
}

export class Event {
    app: App;
    name: string;
    
    constructor(app: App, options: Options) {
        this.app = app;
        this.name = options.name;
    }
}