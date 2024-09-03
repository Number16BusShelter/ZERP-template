import fs from "fs";
import { AuthValidator, Passworder } from "../modules/Passworder";
import { logger } from "../server/logger";
import shelljs from "shelljs";
import { dsInit } from "@zerp/db";

const outputToken = process.argv.includes("--output-token");
const outputFilePath = "api_token.txt"; // Adjust the file path as needed


(async () => {
    logger.info("Starting API token generation")
    await dsInit()
    const authValidator = new AuthValidator();

    const { record, token } = await authValidator.createNewApiAuthorizationToken(
        {
            name: "cli-generated-api-token"
        },
    );

    if (outputToken) {
        // Write key to file
        fs.writeFileSync(outputFilePath, token);
        logger.info(`API Token has been written to file: ${outputFilePath}`);
    } else {
        logger.info(
            `\nSuccessfully created a new API Token [ID ${
                record.id
            }] at ${record.createdAt.toUTCString()}.` +
            `\nTOKEN IS NOT RETRIEVABLE FROM DATABASE!` +
            `\n\n🔑 Save the key for further usage: \x1b[1m${token}\x1b[0m` +
            `\n\nToken is valid until ${record.validUntil.toUTCString()}` +
            `\n\nAdd DEFAULT_API_TOKEN_HASH=${record.hash} to env variables`,
        );
    }

    logger.info(`Running local test: ${((await authValidator.validateRequestAuthorizationToken(token)) ? "valid" : "invalid").toUpperCase() }`)

    shelljs.exit(0)
})();



