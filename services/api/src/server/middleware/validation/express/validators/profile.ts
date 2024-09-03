import { body } from "express-validator";

export const setAvatar = [
    // body('collectionId').exists().isString(),
    body('collectionItemIndex').exists().isNumeric().toInt(),
]
