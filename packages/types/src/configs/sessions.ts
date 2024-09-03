export interface ISessionsConfig {
  secret?: string;
  cleanupLimit?: number;
  limitSubquery?: boolean;
  ttl?: number;
}

export class SessionsConfig implements ISessionsConfig{
  public secret?: string;
  public cleanupLimit?: number;
  public limitSubquery?: boolean;
  public ttl?: number;
}
