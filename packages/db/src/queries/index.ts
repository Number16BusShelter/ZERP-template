import { Between } from "typeorm";
import { Paginate } from "@zerp/types";

export const BetweenDates = (from: Date | string | number, to: Date | string | number) =>
    Between(
        (typeof from === "string" || typeof from === "number") ? new Date(from).toISOString() : from.toISOString(),
        (typeof to === "string" || typeof to === "number") ? new Date(to).toISOString() : to.toISOString(),
    );

/**
 * Paginates a response based on the given data, page, and limit.
 *
 * @param {[any[], number]} data - The data to paginate, where the first element is the result and the second element is the total count.
 * @param {number} page - The current page.
 * @param {number} limit - The number of items per page.
 * @returns {Paginate} An object containing paginated data and metadata.
 */

export function paginateResponse(data, page: number, limit: number): Paginate {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
        rows: [...result],
        count: total,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        lastPage: lastPage,
    };
}
