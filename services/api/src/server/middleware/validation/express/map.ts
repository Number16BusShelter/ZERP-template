import { twaAuthorizationValidations } from "@/src/server/middleware/validation/express/validators/auth";
import { submitReferral } from "@/src/server/middleware/validation/express/validators/private";
import { paginationValidations } from "@/src/server/middleware/validation/express/validators/common";

export const routesToValidatorsMap = {
    "twa_authorization": twaAuthorizationValidations("query"),
    "twa_authorization_body": twaAuthorizationValidations("body"),
    "submit_referral": submitReferral,
    "pagination": paginationValidations,
    "": [],
    undefined: [],
    null: [],
};
