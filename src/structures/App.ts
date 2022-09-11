import express, { Application, Express, Router } from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
import { methods } from './Route';
import { join } from 'path';
import { Pool } from 'pg';

interface Route {
    options: {
        name: string;
        method: methods;
    };
    run: (req: express.Request, res: express.Response) => Application;
    app: App;
}

export class App {

    app: Express;
    router: Router;
    routes: Route[];
    db: Pool;

    constructor() {
        this.app = express();
        this.router = express.Router();
        this.routes = [];
        this.db = new Pool({
            connectionString: process.env.DATABASE_URL
        });
        this.loadRoutes();
        this.loadEvents();
        this.init();
    }

    /**
     * @description Initialize The App Class. (Server, Routes etc.)
     * @return {void}
     */
    
    private async init() {

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(express.json({ type: 'application/vnd.api+json' }));
        this.app.use(cors());

        await this.db.connect();
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`🚀 Server ready at http://localhost:${port}`);
        });
        
        for await (const route of this.routes) {
            this.router[route.options.method](route.options.name, route.run);
        }
        this.app.use(this.router);

        console.log(`[ROUTES] ${this.routes.length} route(s) were loaded correctly. ✔️`);
    }

    /**
     * @description Load All Routes.
     * @return {void}
     */

    private loadRoutes() {
        const categories = readdirSync(join(__filename, "..", "..", "routes"));
        for (const category of categories) {

            const routes = readdirSync(join(__filename, "..", "..", "routes", `${category}`));
            for (const route of routes) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const routeClass = require(join(__filename, "..", "..", "routes", `${category}`, `${route}`));
                const rt = new routeClass(this);
                this.routes.push(rt);
            }
        }
    }

    private loadEvents() {
        const categories = readdirSync('src/events');

        for (const category of categories) {
            const events = readdirSync(`src/events/${category}`);

            for (const event of events) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const eventClass = require(join(process.cwd(), `src/events/${category}/${event}`));
                const evt = new (eventClass)(this);

                this.db.on(evt.name, evt.run);
            }
        }
    }
}