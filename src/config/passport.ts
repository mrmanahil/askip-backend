import { AdminModel } from "../module/adminAuth/model";
import { UserModel } from "../module/userAuth/model";
import {
    Strategy as JWTStrategy,
    ExtractJwt,
    StrategyOptions,
} from "passport-jwt";

import Admin from "../module/adminAuth/model";
import User from "../module/userAuth/model";
const jwtOpts: StrategyOptions = {
    // Tell passport to take the jwt token from the Authorization headers
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "n2r5u7x!TjWnZr4tbQeThWmZ" || "testing_key",
};



export default new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user$ = await UserModel.findOne({
            email: payload.payload,
        }) as User;
        const admin$ = await AdminModel.findOne({
            email: payload.payload,
        }) as Admin;
        if (user$ || admin$) {
            done(null, user$ || admin$);
        } else {
            done(null, false);
        }
    } catch (e) {
        return done(e, false);
    }
});
