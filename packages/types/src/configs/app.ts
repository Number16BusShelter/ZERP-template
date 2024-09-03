export type EnvMode = "development" | "production" | "test" | "migration" | string

export interface AppSessions {
    secret: string
    cleanupLimit: number,
    limitSubquery: boolean,
    ttl: number
}

export interface AppPasswords {
    saltLength: number,
    iterations: number,
    keyLength: number,
    digest: string,
}

export interface AppConfig {
    name: string,
    service: string
    mode: string,
    host: string,
    port: string,
    sld: string | undefined,
    domain: string | undefined,
    handle?: string | null,
    mediaHost?: string,
    staticHost?: string,
    ssl: boolean,
    allowedOrigins: string | string[],
    debug: boolean
    testNet: boolean,
    rootDir: string,
    session?: AppSessions,
    passwords?: AppPasswords
}
