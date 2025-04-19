import { Router } from "express";
import { plainToInstance } from "class-transformer";

import { Users } from "@zerp/db";
import { Unauthenticated } from "@zerp/errors";
import { authenticateJWT, issueJWTToken, asyncErrorHandler } from "@zerp/shared-modules";

// import twaRoutes from "./twa/twa";
// import twa2Routes from "./twa/twa2";
import registerRoutes from "./register/register.route"

const router = Router();

// router.use("/twa", twaRoutes);
// router.use("/twa2", twa2Routes);
router.use("/register", registerRoutes)

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
