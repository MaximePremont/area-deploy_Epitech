import dotenv from "dotenv";
import {Router} from "express";
import {githubOAuthHandler} from "~/controllers/auth/github.auth.controller";
import {twitterOAuthHandler} from "~/controllers/auth/twitter.auth.controller";
import {googleOAuthHandler} from "~/controllers/auth/google.auth.controller";
import {spotifyConnectHandler} from "~/controllers/connect/spotify.connect.controller";
import {googleConnectHandler} from "~/controllers/connect/google.connect.controller";
import {twitterConnectHandler} from "~/controllers/connect/twitter.connect.controller";
import {facebookConnectHandler} from "~/controllers/connect/facebook.connect.controller";
import { verifyToken } from "../middlewares/auth.handler";
import { linkTokenConnectHandler } from "../controllers/connect/link_token.connect.controller";
import { githubConnectHandler } from "../controllers/connect/github.connect.controller";

dotenv.config();

const sessionRouter = Router();

//AUTH
sessionRouter.get('/oauth/google', googleOAuthHandler);
sessionRouter.get('/oauth/github', githubOAuthHandler);
sessionRouter.get('/oauth/twitter', twitterOAuthHandler);

//CONNECT
sessionRouter.get('/oauth/connect/spotify', spotifyConnectHandler)
sessionRouter.get('/oauth/connect/google', googleConnectHandler)
sessionRouter.get('/oauth/connect/github', githubConnectHandler)
sessionRouter.get('/oauth/connect/twitter', twitterConnectHandler)
sessionRouter.get('/oauth/connect/facebook', facebookConnectHandler)

//LINK
sessionRouter.post('/oauth/connect/link', verifyToken, linkTokenConnectHandler);

export default sessionRouter;
