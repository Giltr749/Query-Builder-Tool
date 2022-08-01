import morgan, { StreamOptions } from "morgan";
import Logger from "./winston";

const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message),
};
export const morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms",
    { stream }
)