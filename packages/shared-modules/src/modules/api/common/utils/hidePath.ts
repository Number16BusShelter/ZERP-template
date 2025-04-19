import { isProd } from "@zerp/global-configs";
import { server as serverConfig } from "@zerp/global-configs";

/**
 * Generates a path, optionally hiding it behind a secret route prefix in production environments.
 *
 * @param {string} path - The original path to be potentially hidden.
 * @param {string} [secretRoute] - An optional secret route prefix to prepend to the path if in a production environment.
 * @returns {string} - The resulting path, optionally prefixed with the secret route.
 *
 * @example
 * // Returns "/api/users" in development or "/secret/api/users" in production if secretRoute is "secret".
 * hidePath("/api/users", "secret");
 *
 * @example
 * // Returns "/api/users" in both development and production environments.
 * hidePath("/api/users");
 */
export const hidePath = (path: string, secretRoute: string = serverConfig.secretRoute): string => `${isProd && secretRoute ? `/${secretRoute}` : ""}${path}`;
