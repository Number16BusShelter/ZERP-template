import { Router } from "express";
import twaRoutes from "./twa";
import twa2Routes from "./twa2";

import { authenticateJWT, issueJWTToken } from "./passport";
import { Unauthenticated } from "@zerp/errors";
import { Users } from "@zerp/db";
import { plainToInstance } from "class-transformer";
import { asyncErrorHandler } from "@/src/server/common/http-handlers/handlers";

const router = Router();

router.use("/twa", twaRoutes);
router.use("/twa2", twa2Routes);

router.get("/check",
    authenticateJWT,
    asyncErrorHandler(async (req, res) => {
        if (!req.user) throw new Unauthenticated("User not authenticated!");
        const normalizedUser = plainToInstance(Users, req.user)
        return res.json(normalizedUser.getPublicView());
    }));


router.get("/refresh",
    authenticateJWT,
    asyncErrorHandler(issueJWTToken)
)

export default router;
