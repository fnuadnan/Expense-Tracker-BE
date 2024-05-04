import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

function validateId(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send(`Invalid ${paramName} ID.`);

    next();
  };
}

export default validateId;
