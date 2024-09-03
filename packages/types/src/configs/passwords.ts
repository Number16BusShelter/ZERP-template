export interface IPasswordsConfig {
    saltLength?: number;
    iterations?: number;
    keyLength?: number;
    digest?: string;
}

export class PasswordsConfig implements IPasswordsConfig {
    public saltLength?: number;
    public iterations?: number;
    public keyLength?: number;
    public digest?: string;
}
