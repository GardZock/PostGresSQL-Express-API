import { App } from "../../structures/App";
import { methods, Route } from "../../structures/Route";
import express from 'express';

export = class extends Route {

    constructor(app: App) {
        super(app, {
            name: "/",
            method: methods.GET
        });
    }

    run = (req: express.Request, res: express.Response) => {
        if (!req || !res) {
            return;
        }

        res.status(200).send({
            status: "OK",
            data: {},
            message: "Hello Word!"
        });
    };
};