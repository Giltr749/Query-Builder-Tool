import { createRequire } from "module";
const require = createRequire(import.meta.url);
const indexes = require('./event_indexes.json');

console.log(Object.values(indexes['wifi']).join(','));