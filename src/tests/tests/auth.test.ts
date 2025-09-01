import request from "supertest";
import serverSetup from "../../config/server.config.ts";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { router } from "../../routes.ts";

const app = serverSetup();
app.use('/', router);

let mongo: MongoMemoryServer;


beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});


describe("POST /auth/register", () => {
  it("should register a new user and set session", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "user@gmail.com",
        password: "Pass1234",
        income: 7000,
      });
    console.log(res.status, res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user.name).toBe("John Doe");

    const cookie = res.headers["set-cookie"];
    expect(cookie).toBeDefined();
  });

  it("should reject registration if already logged in", async () => {
    const firstRes = await request(app)
      .post("/auth/register")
      .send({
        name: "Jane Doe",
        email: "jane@gmail.com",
        password: "Pass5678",
        income: 6000,
      });

    const cookie = firstRes.headers["set-cookie"];

    const secondRes = await request(app)
      .post("/auth/register")
      .set("Cookie", cookie)
      .send({
        name: "Another User",
        email: "newuser@gmail.com",
        password: "Pass9876",
        income: 5000,
      });

    expect(secondRes.statusCode).toBe(401);
    expect(secondRes.body.message).toBe("you are already logged in");
  });

  it("should reject registration if email already in use", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "user@gmail.com",
        password: "Pass1234",
        income: 7000,
      });
    const secondRes = await request(app)
      .post("/auth/register")
      .send({
        name: "Jane Doe",
        email: "user@gmail.com",
        password: "Pass5678",
        income: 6000,
      });

    expect(secondRes.statusCode).toBe(409);
    expect(secondRes.body.message).toBe("Email already in use");
  });

  it("should reject registration if there are validation errors", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "user@gmail",
        password: "Pass1234",
        income: 7000,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].path).toBe("email");
  });
});

describe("POST /auth/login", () => {
  it("should log in a user and set session", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "user@gmail.com",
        password: "Pass1234",
        income: 7000,
      });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email: "user@gmail.com",
        password: "Pass1234",
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.message).toBe("Login successful");
    expect(loginRes.body.user.name).toBe("John Doe");

    const cookie = loginRes.headers["set-cookie"];
    expect(cookie).toBeDefined();
  });

  it("should reject login if user not found", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "user24@gmail.com",
        password: "Pass1234",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should reject login if user is already logged in", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "user@gmail.com",
        password: "Pass1234",
        income: 7000,
      });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email: "user@gmail.com",
        password: "Pass1234",
      });

    const secondLoginRes = await request(app)
      .post("/auth/login")
      .set("Cookie", loginRes.headers["set-cookie"])
      .send({
        email: "user@gmail.com",
        password: "Pass1234",
      });

    expect(secondLoginRes.statusCode).toBe(401);
    expect(secondLoginRes.body.message).toBe("you are already logged in");
  });
});

describe("POST /auth/logout", () => {
  it("should log out a user and clear session", async () => {
    let res = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "user@gmail.com",
        password: "Pass1234",
        income: 7000,
      });

    const logoutRes = await request(app)
      .post("/auth/logout")
      .set("Cookie", res.headers["set-cookie"]);

    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.message).toBe("Logout successful");
  });
});