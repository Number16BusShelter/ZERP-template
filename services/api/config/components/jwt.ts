import {errorMessages, rules} from '@zerp/global-configs';

let env = process.env.NODE_ENV || 'development';

export default {
    development: {
        secret: process.env.JWT_SECRET_KEY || 'ZmE3MDFlM2YzMGViOWFhNTI3NmEzYjNmODk4YTRkMjBmODQ0NGU1NWViYmE5M2Y4',
    },
    production: {
        secret: process.env.JWT_SECRET_KEY || rules.REQ("JWT_SECRET_KEY"),
    }
}[env];

