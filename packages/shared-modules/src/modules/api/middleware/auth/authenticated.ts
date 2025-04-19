import {Request, Response} from "express";
import { apiLogger } from "../../../api";


export async function isClientAuthenticated(req: Request, res: Response, next: Function) {
    const {authorization} = req.headers

    if (!authorization)
        return res.status(401).send({message: 'Unauthorized'});

    if (!authorization.startsWith('Bearer'))
        return res.status(401).send({message: 'Unauthorized'});

    const split = authorization.split('Bearer ')

    if (split.length !== 2)
        return res.status(401).send({message: 'Unauthorized'});

    const token = split[1]

    // if (app.mode == 'development') {
    //     const testClient = "86a0d0f1-c5ab-44e4-9e85-7684440cd1fa"
    //     logger.debug(`Using default ${testClient} client for authentication`)
    //
    //     req['client'] = await UsersController.findClientById(testClient)
    //     return next();
    // }

    try {
        // const decodedToken = await new Auth0().getProfile(token)
        // console.log(decodedToken)

        // const clientFbId = decodedToken.user_metadata.fb_id
        // const userFbId = decodedToken.user_metadata.fb_uid
        //
        // // if (!(clientFbId && userFbId)) {
        // //     throw new User
        // // }
        //
        // if (clientFbId) {
        //     req['client'] = await UsersController.findClientById(clientFbId)
        //     if (!req['client']) {
        //             req['client'] = await UsersController.findClientByFbUid(userFbId)
        //     }
        // } else {
        //     req['client'] = await UsersController.findClientByFbUid(userFbId)
        // }
        //
        // req['user'] = await UsersController.findUserById(userFbId)
        // logger.debug(decodedToken, "decodedToken")
        // res.locals = {...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email}
        return next();
    } catch (err: any) {
        // console.error(`${err.code} -  ${err.message}`)
        // throw new Unauthorized(err.message)
        apiLogger.error(err)
        return res.status(401).send({message: 'Unauthorized'});
        // return res.status(401).send({message: 'Unauthorized'});
    }
}
