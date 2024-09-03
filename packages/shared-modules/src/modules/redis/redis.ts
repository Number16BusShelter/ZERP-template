import Redis, { RedisOptions } from "ioredis";
import { logging, redis } from "@zerp/global-configs";
import { createLogger } from "@zerp/utils";


const logger: any = createLogger({...logging, subModule: "redis-client"});


export function createRedisConnection(options: RedisOptions): Redis {
    logger.info(`> Creating IORedis client`);
    options = {
        host: options.host,
        port: options.port,
        ...(options.password ? { password: options.password! } : {}),
    };
    const client = new Redis(options);

    client.on('error', (error) => {
        logger.error(error)
    })

    return client
}

class BaseRedisClient {
    protected redis: Redis;

    constructor(options: RedisOptions) {
        this.redis = createRedisConnection(options);
    }

    async set(key: string, value: any) {
        await this.redis.set(key, value);
        console.log(`set: ${key} = ${value}`);
    }

    async get(key: string) {
        const value = await this.redis.get(key);
        console.log(`get: ${key} = ${value}`);
        return value;
    }

    async keys(pattern: string) {
        const keys = await this.redis.keys(pattern);
        console.log(`keys: ${keys}`);
        return keys;
    }

    async scan(pattern: string) {
        const cursor = 0;
        const keys = await this.redis.scan(cursor, "MATCH", pattern);
        console.log(`scan: ${keys}`);
        return keys;
    }

    async scanStream(pattern: string) {
        const keys = await new Promise<string[]>((resolve, reject) => {
            const stream = this.redis.scanStream({ match: pattern });
            let keys: string[] = [];
            stream.on("data", (resultKeys) => {
                keys = keys.concat(resultKeys);
            });
            stream.on("end", () => {
                resolve(keys);
            });
            stream.on("error", (error) => {
                reject(error);
            });
        });
        console.log(`scanStream: ${keys}`);
        return keys;
    }

    async del(key: string) {
        const result = await this.redis.del(key);
        console.log(`del: ${key} = ${result}`);
        return result;
    }

    async scanDel(pattern: string) {
        const keys = (await this.redis.scan(0, "MATCH", pattern))[1];
        const result = await this.redis.del(keys);
        console.log(`del: ${keys} = ${result}`);
        return result;
    }
}


export class RedisClient extends BaseRedisClient {
    constructor() {
        if (!(redis.single.host && redis.single.port)) throw new Error("Failed to create Redis clicnt");
        const options: RedisOptions = {
            host: redis.single.host,
            port: redis.single.port,
            ...(redis.password ? { password: redis.password! } : {}),
        };
        super(options);
    }
}
