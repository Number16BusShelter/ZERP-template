import { Router } from "express";
import { validateTWAUser } from "@zerp/shared-modules";
import { issueJWTToken } from "@zerp/shared-modules";

const router = Router();


router.post("/",
    ...validateTWAUser,
    issueJWTToken
)

export default router;
