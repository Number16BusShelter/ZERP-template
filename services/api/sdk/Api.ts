/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    cancelToken?: CancelToken;
}

export type RequestParams = Omit<
    FullRequestParams,
    "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
    extends Response {
    data: D;
    error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = "//localhost:7070";
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private abortControllers = new Map<CancelToken, AbortController>();
    private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
        fetch(...fetchParams);

    private baseApiParams: RequestParams = {
        credentials: "same-origin",
        headers: {},
        redirect: "follow",
        referrerPolicy: "no-referrer",
    };

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig);
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key);
        return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key]);
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key];
        return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {};
        const keys = Object.keys(query).filter(
            (key) => "undefined" !== typeof query[key],
        );
        return keys
            .map((key) =>
                Array.isArray(query[key])
                    ? this.addArrayQueryParam(query, key)
                    : this.addQueryParam(query, key),
            )
            .join("&");
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery);
        return queryString ? `?${queryString}` : "";
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null &&
            (typeof input === "object" || typeof input === "string")
                ? JSON.stringify(input)
                : input,
        [ContentType.Text]: (input: any) =>
            input !== null && typeof input !== "string"
                ? JSON.stringify(input)
                : input,
        [ContentType.FormData]: (input: FormData) =>
            (Array.from(input.keys()) || []).reduce((formData, key) => {
                const property = input.get(key);
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                          ? JSON.stringify(property)
                          : `${property}`,
                );
                return formData;
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    };

    protected mergeRequestParams(
        params1: RequestParams,
        params2?: RequestParams,
    ): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected createAbortSignal = (
        cancelToken: CancelToken,
    ): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken);
            if (abortController) {
                return abortController.signal;
            }
            return void 0;
        }

        const abortController = new AbortController();
        this.abortControllers.set(cancelToken, abortController);
        return abortController.signal;
    };

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken);

        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(cancelToken);
        }
    };

    public request = async <T = any, E = any>({
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken,
        ...params
    }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === "boolean"
                ? secure
                : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const queryString = query && this.toQueryString(query);
        const payloadFormatter =
            this.contentFormatters[type || ContentType.Json];
        const responseFormat = format || requestParams.format;

        return this.customFetch(
            `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
            {
                ...requestParams,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type && type !== ContentType.FormData
                        ? { "Content-Type": type }
                        : {}),
                },
                signal:
                    (cancelToken
                        ? this.createAbortSignal(cancelToken)
                        : requestParams.signal) || null,
                body:
                    typeof body === "undefined" || body === null
                        ? null
                        : payloadFormatter(body),
            },
        ).then(async (response) => {
            const r = response.clone() as HttpResponse<T, E>;
            r.data = null as unknown as T;
            r.error = null as unknown as E;

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                      .then((data) => {
                          if (r.ok) {
                              r.data = data;
                          } else {
                              r.error = data;
                          }
                          return r;
                      })
                      .catch((e) => {
                          r.error = e;
                          return r;
                      });

            if (cancelToken) {
                this.abortControllers.delete(cancelToken);
            }

            if (!response.ok) throw data;
            return data;
        });
    };
}

/**
 * @title Clicker bot backend
 * @version 0.0.1
 * @baseUrl //localhost:7070
 * @contact Clicker bot backend
 *
 * API documentation for Web3Events backend
 */
export class Api<
    SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
    client = {
        /**
         * @description This endpoint allows users to create a new clan.
         *
         * @tags Clans
         * @name ClansCreateCreate
         * @summary Create a new clan
         * @request POST:/client/clans/create
         */
        clansCreateCreate: (
            data: {
                /** The name of the clan. */
                name?: string;
                /** The description of the clan. */
                description?: string;
                /** The avatar URL of the clan. */
                avatar?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, void>({
                path: `/client/clans/create`,
                method: "POST",
                body: data,
                format: "json",
                ...params,
            }),

        /**
         * @description This endpoint allows users to create a new clan.
         *
         * @tags Clans
         * @name ClansUpdateCreate
         * @summary Updates a clan that user leads
         * @request POST:/client/clans/update
         */
        clansUpdateCreate: (
            data: {
                /** The name of the clan. */
                name?: string;
                /** The description of the clan. */
                description?: string;
                /** The avatar URL of the clan. */
                avatar?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<any, void>({
                path: `/client/clans/update`,
                method: "POST",
                body: data,
                format: "json",
                ...params,
            }),

        /**
         * @description This endpoint allows users to leave the clan that they lead.
         *
         * @tags Clans
         * @name ClansLeaveCreate
         * @summary Leave the clan that user leads
         * @request POST:/client/clans/leave
         */
        clansLeaveCreate: (params: RequestParams = {}) =>
            this.request<any, void>({
                path: `/client/clans/leave`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * @description Returns profile data of user
         *
         * @tags Client
         * @name ProfileList
         * @summary Returns profile data of user
         * @request GET:/client/profile
         */
        profileList: (params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/client/profile`,
                method: "GET",
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Returns owned collection items of the user
         *
         * @tags Client
         * @name ProfileOwnedList
         * @summary Returns owned collection items of the user
         * @request GET:/client/profile/owned
         */
        profileOwnedList: (params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/client/profile/owned`,
                method: "GET",
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description Sets the user's avatar
         *
         * @tags Client
         * @name ProfileAvatarCreate
         * @summary Sets the user's avatar
         * @request POST:/client/profile/avatar
         */
        profileAvatarCreate: (
            Avatar: {
                /** Index of the avatar to set */
                collectionItemIndex: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<void, void>({
                path: `/client/profile/avatar`,
                method: "POST",
                body: Avatar,
                type: ContentType.Json,
                ...params,
            }),
    };
    clanId = {
        /**
         * @description This endpoint retrieves the details of a specific clan.
         *
         * @tags Clans
         * @name GetClanId
         * @summary Get clan details
         * @request GET:/{clanId}
         */
        getClanId: (clanId: string, params: RequestParams = {}) =>
            this.request<any, void>({
                path: `/${clanId}`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description This endpoint allows users to join a specific clan.
         *
         * @tags Clans
         * @name JoinCreate
         * @summary Join a clan
         * @request POST:/{clanId}/join
         */
        joinCreate: (clanId: string, params: RequestParams = {}) =>
            this.request<any, void>({
                path: `/${clanId}/join`,
                method: "POST",
                format: "json",
                ...params,
            }),

        /**
         * @description This endpoint retrieves the members of a specific clan.
         *
         * @tags Clans
         * @name MembersDetail
         * @summary Get clan members
         * @request GET:/{clanId}/members
         */
        membersDetail: (
            clanId: string,
            query?: {
                /** The sorting order for the leaderboard. */
                leaderboardSorting?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<any[], void>({
                path: `/${clanId}/members`,
                method: "GET",
                query: query,
                format: "json",
                ...params,
            }),
    };
    gamez = {
        /**
         * @description Creates a new single-player game session and returns the session ID and socket URL.
         *
         * @tags GameZ
         * @name PlayModesSingleNewList
         * @summary Start a new single-player game session.
         * @request GET:/gamez/play/modes/single/new
         */
        playModesSingleNewList: (params: RequestParams = {}) =>
            this.request<
                {
                    /** The ID of the game session. */
                    sessionId?: string;
                    /** The URL to connect to the game socket. */
                    socketUrl?: string;
                },
                any
            >({
                path: `/gamez/play/modes/single/new`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Establishes a WebSocket connection to a single-player game session. Players can send game actions and receive updates from the game server through this connection.
         *
         * @name WsGamez
         * @summary Connect to a single-player game session.
         * @request WS:/gamez/play/modes/single/{sessionId}
         */
        wsGamez: (sessionId: string, params: RequestParams = {}) =>
            this.request<
                {
                    /** The message indicating successful connection. */
                    message?: string;
                },
                any
            >({
                path: `/gamez/play/modes/single/${sessionId}`,
                method: "WS",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the total points associated with the user's profile.
         *
         * @tags Profile
         * @name ProfilePointsList
         * @summary Get user points.
         * @request GET:/gamez/profile/points
         */
        profilePointsList: (params: RequestParams = {}) =>
            this.request<
                {
                    /** The total points of the user. */
                    points?: number;
                },
                any
            >({
                path: `/gamez/profile/points`,
                method: "GET",
                format: "json",
                ...params,
            }),

        /**
         * @description Retrieves the sessions associated with the user's profile.
         *
         * @tags Profile
         * @name ProfileSessionsList
         * @summary Get user sessions.
         * @request GET:/gamez/profile/sessions
         */
        profileSessionsList: (params: RequestParams = {}) =>
            this.request<
                {
                    /** The ID of the session. */
                    sessionId?: string;
                    /** The mode of the session (e.g., PvP, PvE). */
                    mode?: string;
                }[],
                any
            >({
                path: `/gamez/profile/sessions`,
                method: "GET",
                format: "json",
                ...params,
            }),
    };
    private = {
        /**
         * No description
         *
         * @tags Referral
         * @name ReferralSubmitCreate
         * @summary Submit a referral
         * @request POST:/private/referral/submit
         * @secure
         */
        referralSubmitCreate: (
            data: {
                /**
                 * Telegram ID of the referrer
                 * @example "123456789"
                 */
                referrerTgId: string;
                /**
                 * Telegram ID of the referral
                 * @example "987654321"
                 */
                referralTgId: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    /** @example true */
                    success?: boolean;
                    /** @example "123456789" */
                    referrerTgId?: string;
                    /** @example "987654321" */
                    referralTgId?: string;
                    /**
                     * Reward for the referral
                     * @example 50
                     */
                    reward?: number;
                    /**
                     * Total charges of the referrer after referral
                     * @example 150
                     */
                    totalCharges?: number;
                },
                {
                    /** @example "Referrer does not exist" */
                    error?: string;
                } | void
            >({
                path: `/private/referral/submit`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };
    public = {
        /**
         * @description This endpoint retrieves the leaderboard scores.
         *
         * @tags Leaderboard
         * @name LeaderboardList
         * @summary Get leaderboard scores
         * @request GET:/public/leaderboard
         */
        leaderboardList: (
            query?: {
                /** The number of items to retrieve per page. */
                take?: number;
                /** The page number to retrieve. */
                page?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    rows?: any[];
                    count?: number;
                },
                any
            >({
                path: `/public/leaderboard`,
                method: "GET",
                query: query,
                format: "json",
                ...params,
            }),

        /**
         * @description This endpoint retrieves the leaderboard scores.
         *
         * @tags Leaderboard
         * @name LeaderboardScoresList
         * @summary Get leaderboard scores
         * @request GET:/public/leaderboard/scores
         */
        leaderboardScoresList: (
            query?: {
                /** The number of items to retrieve per page. */
                take?: number;
                /** The page number to retrieve. */
                page?: number;
            },
            params: RequestParams = {},
        ) =>
            this.request<
                {
                    rows?: any[];
                    count?: number;
                    total?: number;
                    pages?: number;
                    page?: number;
                    take?: number;
                },
                any
            >({
                path: `/public/leaderboard/scores`,
                method: "GET",
                query: query,
                format: "json",
                ...params,
            }),
    };
    tonConnect = {
        /**
         * @description TONConnect Manifest file
         *
         * @tags TONConnect
         * @name ManifestJsonList
         * @summary TONConnect manifest.json
         * @request GET:/ton-connect/manifest.json
         */
        manifestJsonList: (params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/ton-connect/manifest.json`,
                method: "GET",
                ...params,
            }),

        /**
         * @description Send proof for validation
         *
         * @tags TONConnect
         * @name CheckProofCreate
         * @summary Send proof
         * @request POST:/ton-connect/check-proof
         */
        checkProofCreate: (params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/ton-connect/check-proof`,
                method: "POST",
                ...params,
            }),

        /**
         * @description Get payload for proof generation
         *
         * @tags TONConnect
         * @name GeneratePayloadCreate
         * @summary Payload for proof generation
         * @request POST:/ton-connect/generate-payload
         */
        generatePayloadCreate: (params: RequestParams = {}) =>
            this.request<void, void>({
                path: `/ton-connect/generate-payload`,
                method: "POST",
                ...params,
            }),
    };
}
