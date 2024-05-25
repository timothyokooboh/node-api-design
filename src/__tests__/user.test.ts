import supertest from "supertest";
import app from "../server";
import * as user from "../handlers/user";

describe("user handler", () => {
  it("create new user", async () => {
    // mock request
    const req = {
      body: {
        username: "test",
        password: "test",
      },
    };

    // mock response
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await user.createNewUser(req, res, () => {});
  }, 10000);
});
