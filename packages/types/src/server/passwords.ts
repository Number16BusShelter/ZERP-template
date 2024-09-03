/**
 * Interface representing the transport of secret token information.
 */
import { BinaryToTextEncoding } from "crypto";

// CryptoOptions and SecretTokenTransport definitions remain the same
export type CryptoOptions = {
    keyLength: number;
    saltLength?: number;
    iterations: number;
    hashAlgorithm: string;
    stringEncoding?: BufferEncoding;
    inputEncoding?: BufferEncoding;
    hashEncoding?: BinaryToTextEncoding;
    delimiter?: string;
};

export declare class SecretTokenTransport implements CryptoOptions {
    keyLength: number;
    saltLength?: number;
    iterations: number;
    hashAlgorithm: string;
    salt: string;
    hashed: string;
    stringEncoding?: BufferEncoding;
    inputEncoding?: BufferEncoding;
    hashEncoding?: BinaryToTextEncoding;
    delimiter?: string;
}
