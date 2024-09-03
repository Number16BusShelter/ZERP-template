import { Router } from "express";
import { validateTWAUser } from "../../middleware/auth/twa";
import { issueJWTToken } from "@/src/server/routes/auth/passport";

const router = Router();


router.post("/",
    ...validateTWAUser,
    issueJWTToken
)

export default router;
