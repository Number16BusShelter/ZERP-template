import { body } from "express-validator";


export const submitReferral = [
    body('referrerTgId').exists().isNumeric().toInt(),
    body('referralTgId').exists().isNumeric().toInt(),
]
