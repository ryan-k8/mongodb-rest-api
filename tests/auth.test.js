const request = require("supertest");

const app = require("../app");
const Token = require("../models/resetToken");
const {
  testUserOneId,
  testUserOne,
  setupDatabase,
  cleanDatabase,
} = require("./fixtures/db");

beforeAll(setupDatabase);

describe("auth controller", () => {
  describe("register user", () => {
    it("should return 409 if user exists already", async () => {
      const response = await request(app).post("/auth/register").send({
        name: testUserOne.name,
        email: testUserOne.email,
        password: testUserOne.password,
      });
      expect(response.statusCode).toBe(409);
    });

    it("should return 422 on invalid credentials", async () => {
      await request(app)
        .post("/auth/register")
        .send({
          name: "invalid test user",
          password: "fas",
          email: "wrongemail.com",
        })
        .expect(422);
    });

    it("should return 201 on successful registration", async () => {
      await request(app)
        .post("/auth/register")
        .field("name", "test user two")
        .field("password", "validpassword")
        .field("email", "testuserTwo@gmail.com")
        .attach("image", "tests/fixtures/default-user.jpg")
        .expect(201);
    });
  });

  describe("login user ", () => {
    it("should return 401 on incorrect password/email", async () => {
      await request(app)
        .post("/auth/login")
        .send({
          email: "invalidtestuserTwo@gmail.com",
          password: "wrongpassword",
        })
        .expect(401);
    });

    it("should return 200, accessToken &refreshToken on correct credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "testuserTwo@gmail.com",
        password: "validpassword",
      });

      expect(response.body).not.toBeNull();
      expect(response.body.accessToken).not.toBeUndefined();
      expect(response.body.refreshToken).not.toBeUndefined();
      expect(response.statusCode).toBe(200);
    });
  });

  describe("refresh  token", () => {
    it("should return 400 if no token send", async () => {
      await request(app)
        .post("/auth/refresh-token")
        .set("x-auth-refresh-token", "")
        .expect(400);
    });

    it("should return 200 and access& new refresh token on correct token", async () => {
      const {
        body: { refreshToken },
      } = await request(app).post("/auth/login").send({
        email: testUserOne.email,
        password: testUserOne.password,
      });

      const response = await request(app)
        .post("/auth/refresh-token")
        .set("x-auth-refresh-token", refreshToken)
        .expect(200);

      expect(response.body.accessToken).not.toBeUndefined();
      expect(response.body.refreshToken).not.toBeUndefined();
    });
  });

  describe("logout", () => {
    it("should return 400 on no token", async () => {
      await request(app)
        .delete("/auth/logout")
        .set("x-auth-refresh-token", "")
        .expect(400);
    });

    it("should return 204 on correct refresh token ", async () => {
      const {
        body: { refreshToken },
      } = await request(app).post("/auth/login").send({
        email: testUserOne.email,
        password: testUserOne.password,
      });
      await request(app)
        .delete("/auth/logout")
        .set("x-auth-refresh-token", refreshToken)
        .expect(204);
    });
  });

  describe("reset password", () => {
    it("should return 422 on invalid email", async () => {
      await request(app)
        .post("/auth/reset-password")
        .send({
          email: "invalidemai.com",
        })
        .expect(422);
    });

    it("should return 400 on non-existing user", async () => {
      await request(app)
        .post("/auth/reset-password")
        .send({
          email: "nonexisting@gmail.com",
        })
        .expect(400);
    });

    it("should return 200 and create token on exisiting user", async () => {
      await request(app)
        .post("/auth/reset-password")
        .send({
          email: testUserOne.email,
        })
        .expect(200);
      const token = await Token.find({ userId: testUserOneId });

      expect(token).not.toBeUndefined();
    });
  });

  describe("verify and reset password", () => {
    it("should return 400 on expired token or invalid link", async () => {
      const invalidUserId = testUserOneId;
      invalidUserId[0] = "f";

      await request(app)
        .post(`/auth/reset-password/${invalidUserId}/wrongorexpiredtoken`)
        .send({ password: "validpassword" })
        .expect(400);
    });

    it("should change password on correct link or existing token ", async () => {
      const token = await Token.findOne({ userId: testUserOneId });

      const response = await request(app)
        .post(`/auth/reset-password/${testUserOneId}/${token.token}`)
        .send({
          password: "testuseroneNewPass",
        });
      expect(response.statusCode).toBe(200);

      await request(app)
        .post("/auth/login")
        .send({
          email: testUserOne.email,
          password: testUserOne.password,
        })
        .expect(401);

      await request(app)
        .post("/auth/login")
        .send({
          email: testUserOne.email,
          password: "testuseroneNewPass",
        })
        .expect(200);
    });
  });
});

afterAll(cleanDatabase);
