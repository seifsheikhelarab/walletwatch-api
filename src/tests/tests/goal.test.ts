import request from "supertest";
import serverSetup from "../../config/server.config.ts";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { router } from "../../routes.ts";

const app = serverSetup();
app.use('/', router);

let cookie: string;
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

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  let befRes = await request(app)
    .post("/auth/register")
    .send({
      name: "John Doe",
      email: "user@gmail.com",
      password: "Pass1234",
      income: 7000,
    });

  cookie = befRes.headers["set-cookie"];
});

describe("POST /goals", () => {
  it("should create a new goal", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": 5000, "deadline": "2023-12-31" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Goal set successfully");
  });

  it("should return 400 if request body is invalid", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": "invalid", "deadline": "2023-12-31" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});

describe("GET /goals", () => {
  it("should return a 404 if no goals are found", async () => {
    const res = await request(app)
      .get("/goals")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No goals found");
  });

  it("should return a list of goals", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": 5000, "deadline": "2023-12-31" });

    const goalId = res.body.goal._id;

    const res2 = await request(app)
      .get("/goals")
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.goals[0]._id).toBe(goalId);
  });
});

describe("GET /goals/:id", () => {
  it("should return a 404 if no goal is found", async () => {
    let id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/goals/${id}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Goal not found");
  });

  it("should return a goal", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": 5000, "deadline": "2023-12-31" });

    const goalId = res.body.goal._id;

    const res2 = await request(app)
      .get(`/goals/${goalId}`)
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.goal.title).toBe("My goal");
  })
});

describe("PUT /goals/:id", () => {
  it("should update a goal", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": 5000, "deadline": "2023-12-31" });

    const goalId = res.body.goal._id;

    const res2 = await request(app)
      .put(`/goals/${goalId}`)
      .set("Cookie", cookie)
      .send({ "title": "My updated goal", "targetAmount": 6000, "deadline": "2023-12-31", "status": "active" });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.goal.title).toBe("My updated goal");
  });

  it("should return a 404 if no goal is found", async () => {
    let id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/goals/${id}`)
      .set("Cookie", cookie)
      .send({ "title": "My updated goal", "targetAmount": 6000, "deadline": "2023-12-31", "status": "active" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Goal not found");
  });

  it("should return 400 if request body is invalid", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": 5000, "deadline": "2023-12-31" });

    const goalId = res.body.goal._id;

    const res2 = await request(app)
      .put(`/goals/${goalId}`)
      .set("Cookie", cookie)
      .send({ "title": "My updated goal", "targetAmount": "invalid", "deadline": "2023-12-31" });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBeDefined();
  });
});

describe("DELETE /goals/:id", () => {
  it("should delete a goal", async () => {
    const res = await request(app)
      .post("/goals")
      .set("Cookie", cookie)
      .send({ "title": "My goal", "targetAmount": 5000, "deadline": "2023-12-31" });

    const goalId = res.body.goal._id;

    const res2 = await request(app)
      .delete(`/goals/${goalId}`)
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.message).toBe("Goal deleted successfully");
  });

  it("should return a 404 if no goal is found", async () => {
    let id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/goals/${id}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Goal not found");
  });
});