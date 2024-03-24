import { NextFunction, Request, Response } from "express";
import AppDataSource from "../database/typeormConfig";
import { User } from "../models/user";
import { decodeToken } from "../utility/token";
import { sendResponse } from "../utility/utils";
import { UserType } from "../constant/constant";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const apiToken = req.headers?.authorization?.split(" ")[1] || "";
    req.user = {} as any;
    if (!apiToken) {
      return res
        .status(401)
        .json(sendResponse(false, "Please provide authorization token", {}));
    }
    const decoded = await decodeToken(apiToken);
    if (!decoded.auth) {
      return res
        .status(401)
        .json(sendResponse(false, "You are not authorised", {}));
    }
    const { userId, userType } = decoded;
    const query = AppDataSource.manager
      .createQueryBuilder(User, "user")
      .where("user.id = :id", { id: userId });
    const userData = await query.getOne();
    if (!userData) {
      return res
        .status(401)
        .json(sendResponse(false, "You are not authorised", {}));
    }
    //we can add user info into the req
    req.user = {
      userId: userData?.id as number,
      userType: userData?.userType as unknown as number,
    };
    return next();
  } catch (error) {
    return res
      .status(500)
      .json(sendResponse(false, "Something went wrong.", {}));
  }
}

export function checkUserAccess(requiredRoles: UserType[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const userRole = req.user?.userType;
    if (!userRole || !requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json(
          sendResponse(
            false,
            "Forbidden : Sorry.You don't have access for this api.",
            {}
          )
        );
    }
    return next();
  };
}

export interface UserInterface {
  userId: number;
  userType: number;
}

declare module "express" {
  interface Request {
    user?: UserInterface;
  }
}
