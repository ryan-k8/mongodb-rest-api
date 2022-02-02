const {
  next,
  nextObject,

  mockReq,
  reset,
} = require("./fixtures/jwt");
const { testUserOneId } = require("./fixtures/db");
const jwtAuth = require("../middlewares/jwt-auth");
const { signAccessToken } = require("../util/jwt");
const { ExpressError } = require("../util/err");

beforeEach(reset);

describe("jwt (auth) middleware", () => {
  it("should attach user id object to req.user on valid token", async () => {
    const validToken = await signAccessToken(testUserOneId.toString());

    mockReq.headers = { authorization: `Bearer ${validToken}` };

    await jwtAuth(mockReq, null, next);
    expect(nextObject.nextCalled).toBe(true);
    expect(nextObject.passedErr).toBe(false);
    expect(mockReq.user).toMatchObject({ uid: testUserOneId.toString() });
  });

  it("should return an err of 401 status code on invalid/expired token", async () => {
    const invalidToken =
      "jVmNTA0MTM4OTY0Z6GewjqOKgeJAXT7zgFuBKzw4VOt20wLkI9U7j9hw";

    mockReq.headers = { authorization: `Bearer ${invalidToken}` };
    await jwtAuth(mockReq, null, next);

    expect(nextObject.passedErr instanceof ExpressError).toBe(true);
    expect(nextObject.passedErr.statusCode).toBe(401);
  });
});

afterEach(reset);
