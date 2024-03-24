import Jwt from "jsonwebtoken";
import { JWT_KEY, ACCESS_TOKEN_LIFETIME } from "../config/config";
import { UserType } from "../constant/constant";

const key: string = JWT_KEY as string;
export interface InvalidToken {
  auth: boolean;
}
export interface TokenData {
  userId?: number;
  userType?: UserType;
  data?: string;
}

export interface ITokenBase {
  userId?: number;
  iat?: string;
  userType?: UserType;
  auth?: boolean;
}

export function createToken(
  tokenData: TokenData,
  exp_time = ACCESS_TOKEN_LIFETIME
): Promise<string> {
  return new Promise((resolve, reject) => {
    const _data = tokenData;
    return Jwt.sign(
      _data,
      key,
      { algorithm: "HS256", expiresIn: exp_time },
      function (err, token) {
        if (err) reject(err);
        return resolve(token as string);
      }
    );
  });
}

export function decodeToken(token: string): Promise<ITokenBase> {
  return new Promise((resolve) => {
    Jwt.verify(token, key, async function (err, decodedData) {
      if (err) {
        return resolve({ ...(decodedData as ITokenBase), auth: false });
      }
      return resolve({ ...(decodedData as ITokenBase), auth: true });
    });
  });
}
