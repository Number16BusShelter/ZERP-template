import z from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const paginationRegistry = new OpenAPIRegistry();
// Pagination schema
export const PaginationRequestSchema = z.object({
    take: z.preprocess(
        (value) => (typeof value === "string" ? Number(value) : value),
        z.number().min(1).optional(),
    ).openapi({ description: "The number of items to retrieve per page" }),

    page: z.preprocess(
        (value) => (typeof value === "string" ? Number(value) : value),
        z.number().min(1).optional(),
    ).openapi({ description: "The page number to retrieve" }),
    sortOrder: z.enum(["ASC", "DESC"]).optional()
        .openapi({ description: "The order in which to sort the leaderboard" }),
    search: z.string().optional(),
});

export const PaginationResponseSchema = z.object({
    count: z.number().openapi({
        description: "Total number of items available",
        example: 100,
    }),
    currentPage: z.number().openapi({
        description: "The current page number",
        example: 1,
    }),
    nextPage: z.number().nullable().openapi({
        description: "Next page number, if available",
        example: 2,
    }),
    prevPage: z.number().nullable().openapi({
        description: "Previous page number, if available",
        example: null,
    }),
    lastPage: z.number().openapi({
        description: "The last available page number",
        example: 10,
    }),
});

paginationRegistry.register("PaginationRequestSchema", PaginationRequestSchema);
paginationRegistry.register("PaginationResponseSchema", PaginationResponseSchema);

global.globalRegistry.push(paginationRegistry);
