import { Router } from "express";
import config from "../../../../config";
import { generatePayload } from "./payload";
import { validateTWAUser } from "../../middleware/auth/twa";
import { validateTonConnect, WalletConfig } from "@/src/modules/TonConnect/signatureVerify";
import {
    AddressesController,
    TonConnectSessionStorage,
    Users,
    UsersController,
} from "@zerp/db";
import { checkValidationResult, createValidationFor } from "src/server/middleware/validation/express";
import { TonConnectAuthFailure } from "@zerp/errors";
import { asyncErrorHandler } from "@/src/server/common/http-handlers/handlers";

const router = Router();

/**
 * @swagger
 * /ton-connect/manifest.json:
 *   get:
 *     description: TONConnect Manifest file
 *     summary: TONConnect manifest.json
 *     tags:
 *       - TONConnect
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *           description: OK
 *       400:
 *           description: Bad request
 *       500:
 *           description: Unknown server error
 *
 */

router.get("/manifest.json",
    (req, res) => {
    const manifest = config.tonConnect.manifest;
    return res.status(200).json(manifest);
});

/**
 * @swagger
 * /ton-connect/check-proof:
 *   post:
 *     description: Send proof for validation
 *     summary: Send proof
 *     tags:
 *       - TONConnect
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *           description: OK
 *       400:
 *           description: Bad request
 *       500:
 *           description: Unknown server error
 *
 */

router.post("/check-proof",
    createValidationFor(""),
    checkValidationResult,
    ...validateTWAUser,
    asyncErrorHandler(async (req, res) => {
            const data: WalletConfig = req.body;
            const uc = new UsersController();
            let user = req["user"] as Users;

            const { address, publicKey } = await validateTonConnect(data);

            let addressEnt
            try {
                addressEnt = await new AddressesController().createOrUpdate({
                    address: address,
                    user: {
                        id: user.id,
                    },
                }, {
                    address: address,
                    publicKey: publicKey,
                    user: user,
                    encoding: "hex",
                    type: "wallet",
                });
            } catch (e) {
                throw new TonConnectAuthFailure(`Address ${address} already exists!`)
            }

            const tcs = new TonConnectSessionStorage(user.id);
            const key = "dapp";
            await tcs.setItem(key, data.account.walletStateInit);
            // const session = await tcs.getItem(key)
            // const tonConnectSession = await tcs.get({session: session!})

            await uc.createOrUpdate({
                id: user.id,
            }, {
                activeSessionAddressId: addressEnt.id,
                onBoardingComplete: true,
            } as Partial<Users>);

            user = await uc.get({ id: user.id }, ["tgUser", "addresses", "tonConnectSession", "profile"]);

            res.json(user);
    }),
);


/**
 * @swagger
 * /ton-connect/generate-payload:
 *   post:
 *     description: Get payload for proof generation
 *     summary: Payload for proof generation
 *     tags:
 *       - TONConnect
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *           description: OK
 *       400:
 *           description: Bad request
 *       500:
 *           description: Unknown server error
 *
 */

router.post("/generate-payload",
    createValidationFor(""),
    checkValidationResult,
    ...validateTWAUser,
    (req, res) => {
        res.json( {
            payload: generatePayload(req["user"]["id"]),
        })
    });


router.post("/disconnect",
    (req, res) => {

    });

export default router;
