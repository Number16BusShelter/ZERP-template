import { Router } from "express";

import authenticatedRoute from "./authenticated"

const router = Router()

router.use("/authenticated", authenticatedRoute)

export default router
