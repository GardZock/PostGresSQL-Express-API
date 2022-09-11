import { App } from "./src/structures/App";
import { config } from 'dotenv';
config({ path: `.env` });
new App();