import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utility/utils";

export const validateBody = (schema: {
  validate: (arg0: any) => { error: any };
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(
        sendResponse(false, "Bad Request", {
          message: error.details[0].message,
          ...error,
        })
      );
    }
    return next();
  };
};

export const validateParams = (schema: {
  validate: (arg0: any) => { error: any };
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json(
        sendResponse(false, "Bad Request", {
          message: error.details[0].message,
          ...error,
        })
      );
    }
    return next();
  };
};

export const validateQuery = (schema: {
  validate: (arg0: any) => { error: any };
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json(
        sendResponse(false, "Bad Request", {
          message: error.details[0].message,
          ...error,
        })
      );
    }
    return next();
  };
};
