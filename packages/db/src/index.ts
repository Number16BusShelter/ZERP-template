/**
 * @module @zerp/db
 * Main module for the @a6g/db package.
 * @description This module provides access to utilities, entities, controllers, and queries
 *              for managing a data source using AppDataSource.
 * @exports dsInit - Function to initialize the data source.
 * @exports AppDataSource - The main data source class.
 * @exports queries - Module containing various data queries.
 * @exports entities - Module containing entity definitions.
 * @exports utils - Module containing utility functions.
 * @exports controllers - Module containing various controllers for data management.
 * @exports runMigrations - Script to run migrations
 * @default AppDataSource - The default export is the main data source class (AppDataSource).
 * @example
 * // Importing individual components
 * import { dsInit, AppDataSource, queries, entities, utils, controllers } from "@a6g/db";
 *
 * // Initializing the data source
 * dsInit();
 *
 * // Accessing controllers
 * const { UsersController, TgUsersController } = controllers;
 *
 * // Using utility functions
 * const result = utils.someUtilityFunction();
 */

import * as utils from "./utils";
import * as entities from "./entities";
import * as controllers from "./controllers";
import * as queries from "./queries";

/**
 * Function to initialize the data source.
 * @function
 * @name dsInit
 * @example
 * // Initialize the data source
 * dsInit();
 */
export * from "./utils";
export * from "./entities";
export * from "./controllers";
export * from "./queries";

/**
 * Main data source class.
 * @class
 * @name AppDataSource
 * @example
 * // Import the default data source
 * import AppDataSource from "@a6g/db";
 *
 * // Create an instance of the data source
 * const dataSource = new AppDataSource();
 */
import AppDataSource, {
    dsInit,
    dsStop,
    runMigrations,
    entityManager,
    logger
} from "./data-source";
import {DatabaseApp} from "./db-app"

export {
    DatabaseApp,
    dsInit,
    dsStop,
    AppDataSource,
    entityManager,
    queries,
    entities,
    utils,
    controllers,
    runMigrations,
    logger
};

export default AppDataSource;
