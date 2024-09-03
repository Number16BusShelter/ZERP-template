import "reflect-metadata";
import { Type } from "class-transformer";

export class Cors {
    public origin?: string | string[];
    public credentials?: boolean
}

export class SocketIOConfig {
    public port?: number;
    public pingTimeout?: number;
    public pingInterval?: number;
    @Type(() => Cors)
    public cors?: Cors;
}

