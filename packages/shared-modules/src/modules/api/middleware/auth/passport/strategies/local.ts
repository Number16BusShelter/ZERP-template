import {Strategy} from 'passport-local';
// import {anyCredPasswordLogin} from "src/server/routes/auth/passport/index";

const LocalStrategy = new Strategy({
    usernameField: "email",
    passwordField: "password"
}, (id, password, done) => () => {})


export default LocalStrategy;
