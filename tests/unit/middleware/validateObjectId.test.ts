import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import validateObjectId from "../../../middleware/validateObjectId";

describe("validate id middleware", () => {
  it("should return 404 if the object ID is not valid", () => {
    const mockRequest = { params: { id: "invalid_id" } } as unknown as Request;
    const mockResponse = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as unknown as NextFunction;

    const test = "test";
    validateObjectId(test)(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith(`Invalid ${test} ID.`);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() if the object ID is valid", () => {
    const mockRequest = {
      params: { id: new mongoose.Types.ObjectId().toHexString() },
    } as unknown as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn();

    const middleware = validateObjectId("ID");
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
