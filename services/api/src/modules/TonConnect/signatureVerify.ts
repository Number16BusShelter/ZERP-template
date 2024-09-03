import {TonProofItemReplySuccess} from '@tonconnect/protocol'
import {Wallet} from '@tonconnect/sdk'
import {createHash} from 'crypto'
import {Address, Cell} from '@ton/ton'
import nacl from 'tweetnacl'
import axios, {AxiosError} from "axios";
import {TonConnectAuthFailure} from "@zerp/errors";

// Example implementation https://github.com/MarioGranada/tonconnect-js-poc/blob/main/tonConnect.ts

export interface WalletConfig {
    device: {
        platform: string;
        appName: string;
        appVersion: string;
        maxProtocolVersion: number;
        features: (string | {
            name: string;
            maxMessages: number;
        })[];
    };
    provider: string;
    account: {
        address: string;
        chain: string;
        walletStateInit: string;
        publicKey: string;
    };
    connectItems: {
        tonProof: {
            name: string;
            proof: {
                timestamp: number;
                domain: {
                    lengthBytes: number;
                    value: string;
                };
                signature: string;
                payload: string;
            };
        };
    };
    name: string;
    appName: string;
    imageUrl: string;
    aboutUrl: string;
    tondns: string;
    platforms: string[];
    bridgeUrl: string;
    universalLink: string;
    jsBridgeKey: string;
    injected: boolean;
    embedded: boolean;
    openMethod: string;
}

interface Domain {
    LengthBytes: number // uint32 `json:"lengthBytes"`
    Value: string // string `json:"value"`
}

interface ParsedMessage {
    Workchain: number // int32
    Address: Buffer // []byte
    Timstamp: number // int64
    Domain: Domain // Domain
    Signature: Buffer // []byte
    Payload: string // string
    StateInit: string // string
}

const tonProofPrefix = 'ton-proof-item-v2/'
const tonConnectPrefix = 'ton-connect'

export async function CreateMessage(message: ParsedMessage): Promise<Buffer> {
    // wc := make([]byte, 4)
    // binary.BigEndian.PutUint32(wc, uint32(message.Workchain))

    const wc = Buffer.alloc(4)
    wc.writeUint32BE(message.Workchain)

    // ts := make([]byte, 8)
    // binary.LittleEndian.PutUint64(ts, uint64(message.Timstamp))

    const ts = Buffer.alloc(8)
    ts.writeBigUint64LE(BigInt(message.Timstamp))

    // dl := make([]byte, 4)
    // binary.LittleEndian.PutUint32(dl, message.Domain.LengthBytes)
    const dl = Buffer.alloc(4)
    dl.writeUint32LE(message.Domain.LengthBytes)

    const m = Buffer.concat([
        Buffer.from(tonProofPrefix),
        wc,
        message.Address,
        dl,
        Buffer.from(message.Domain.Value),
        ts,
        Buffer.from(message.Payload),
    ])

    // const messageHash =  //sha256.Sum256(m)
    // const messageHash = await crypto.subtle.digest('SHA-256', m)
    // const m = Buffer.from(tonProofPrefix)
    // m.write(ts)

    // m := []byte(tonProofPrefix)
    // m = append(m, wc...)
    // m = append(m, message.Address...)
    // m = append(m, dl...)
    // m = append(m, []byte(message.Domain.Value)...)
    // m = append(m, ts...)
    // m = append(m, []byte(message.Payload)...)

    const messageHash = createHash('sha256').update(m).digest()

    const fullMes = Buffer.concat([
        Buffer.from([0xff, 0xff]),
        Buffer.from(tonConnectPrefix),
        Buffer.from(messageHash),
    ])
    // []byte{0xff, 0xff}
    // fullMes = append(fullMes, []byte(tonConnectPrefix)...)
    // fullMes = append(fullMes, messageHash[:]...)

    // const res = await crypto.subtle.digest('SHA-256', fullMes)
    const res = createHash('sha256').update(fullMes).digest()
    return Buffer.from(res)
}

export function ConvertTonProofMessage(
    walletInfo: Wallet,
    tp: TonProofItemReplySuccess
): ParsedMessage {
    const address = Address.parse(walletInfo.account.address)

    return {
        Workchain: address.workChain,
        Address: address.hash,
        Domain: {
            LengthBytes: tp.proof.domain.lengthBytes,
            Value: tp.proof.domain.value,
        },
        Signature: Buffer.from(tp.proof.signature, 'base64'),
        Payload: tp.proof.payload,
        StateInit: walletInfo.account.walletStateInit,
        Timstamp: tp.proof.timestamp,
    }
}

const getPublicKey = (receivedStateInit: string, receivedAddress: string) => {
    // !!!! UNDER CONSTRUCTION !!!!!
    const cell = Cell.fromBase64(receivedStateInit);

    const hash = cell.hash();
    const encodedHash = hash.toString('hex');
    if (!receivedAddress.endsWith(encodedHash)) {
        throw new Error("Address does not match hash");
    }
    const publicKey = cell.refs[1].bits.substring(16, 40);
    return publicKey;
};

const getPublicKeyFromTONAPI = async (walletAddress): Promise<Buffer> => {
    let data
    try {
        data = (await axios(
            `https://${
                'testnet.'
            }tonapi.io/v1/wallet/getWalletPublicKey?account=${encodeURI(walletAddress)}`
        )).data!
        return Buffer.from(data.publicKey, 'hex')
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new TonConnectAuthFailure('Failed to retrieve wallet public key')
        }
        throw error
    }
}

export async function validateTonConnect(body: WalletConfig) {
    //https://docs.ton.org/ko/develop/dapps/ton-connect/sign
    const walletInfo = body as Wallet
    if (!walletInfo?.connectItems?.tonProof) {
        throw new Error('Proof was not provided!')
    }

    const receivedStateInit = body.account.walletStateInit;
    const address = walletInfo.account.address;
    const proof = walletInfo.connectItems.tonProof as TonProofItemReplySuccess

    let pubkey;

    if (walletInfo.account.publicKey) {
        pubkey = Buffer.from(walletInfo.account.publicKey, 'hex')
    } else {
        pubkey = await getPublicKeyFromTONAPI(address)
    }

    const parsedMessage = ConvertTonProofMessage(walletInfo, proof)
    const checkMessage = await CreateMessage(parsedMessage)

    const verifyRes = SignatureVerify(pubkey, checkMessage, parsedMessage.Signature)
    if (!verifyRes) {
        throw new TonConnectAuthFailure('Proof validation failed!')
    }

    return {
        address: Address.parse(walletInfo.account.address).toString(),
        publicKey: pubkey.toString('hex'),
    }
}

export function SignatureVerify(pubkey: Buffer, message: Buffer, signature: Buffer): boolean {
    return nacl.sign.detached.verify(message, signature, pubkey)

    // return ed25519.Verify(pubkey, message, signature)
}
