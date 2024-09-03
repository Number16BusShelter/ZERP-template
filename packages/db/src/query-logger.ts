import { Logger, QueryRunner } from "typeorm";
import { AppLogger } from "@zerp/utils";

// DOCS: https://github.com/typeorm/typeorm/blob/master/docs/logging.md

export class QueryLogger implements Logger {
    constructor(private readonly logger: AppLogger) {}

    log(level: "log" | "info" | "warn" | "debug", message: any, queryRunner?: QueryRunner): any {
        this.logger.log(level, message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.logger.info(message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.debug({
            message: `Running query`,
            query,
            parameters,
        });
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.error({
            message: `DB manager encountered an error: ${error}`,
            error,
            query,
            parameters,
        });
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.warn({
            message: `Query is running slow! (${time} ms)`,
            query,
            parameters,
        });
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.logger.info({
            message,
        });
    }
}
