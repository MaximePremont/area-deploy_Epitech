import { NextFunction, Request, Response } from "express";
import Logging from "~/lib/logging";
import {BadRequestException} from "~/utils/exceptions";
import {
  getGithubOauthToken,
  getGithubUser,
} from "~~/services/github-session.service";
import { prisma } from "~/lib/prisma";
import { generateToken } from "~/controllers/auth/auth.controller";
import { getRedirectUri } from "../../utils/req";

export const githubOAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = req.query.code as string;
  const platform = (req.query.platform as string) || "web";

  if (!code) {
    Logging.warning("Github OAuth: No code provided");
    throw new BadRequestException("No code provided");
  }

  const { access_token } = await getGithubOauthToken({ code, redirect_uri: getRedirectUri(req) });
  if (!access_token) {
    Logging.error("Github OAuth: getGithubOauthToken failed");
    throw new BadRequestException("No access_token provided");
  }
  const { id, name } = await getGithubUser(access_token);

  const names: string[] = name.split(" ", 2);
  const first_name: string = names[0];
  const last_name: string = names[1] || "";

  const user = await prisma.user.upsert({
    where: {
      github_id: id.toString(),
    },
    update: {
      first_name: first_name,
      last_name: last_name,
      provider: "github",
      github_id: id.toString(),
    },
    create: {
      first_name: first_name,
      last_name: last_name,
      provider: "github",
      github_id: id.toString(),
    },
  });

  const token = await generateToken(user, res);
  Logging.info(`User ${user.first_name} logged in w/ github`);
  Logging.info(`Redirecting`);
  if (platform === "mobile") {
    res.redirect(
      `mobile://com.mobile/CallbackLogin/${token}`
    );
  } else {
    res.redirect(
      `${process.env.CORS_FRONT_URL}/oauth_callback?access_token=${token}`
    );
  }
};
