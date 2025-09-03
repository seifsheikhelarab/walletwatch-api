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

describe("POST /budgets", () => {
  it("should create a new budget", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: 1000, startDate: "2023-01-01", endDate: "2023-12-31" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Budget set successfully");
  });

  it("should return 400 if request body is invalid", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: "invalid", startDate: "2023-01-01", endDate: "2023-12-31" });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBeDefined();
  });
});

describe("GET /budgets", () => {
  it("should return a 404 if no budgets are found", async () => {
    const res = await request(app)
      .get("/budgets")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No budgets found");
  });

  it("should return budgets", async () => {
    await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: 1000, startDate: "2023-01-01", endDate: "2023-12-31" });

    const res = await request(app)
      .get("/budgets")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.budgets.length).toBe(1);
  })
});

describe("GET /budgets/:id", () => {
  it("should return a 404 if no budget is found", async () => {
    let id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/budgets/${id}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Budget not found");
  });

  it("should return a budget", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: 1000, startDate: "2023-01-01", endDate: "2023-12-31" });

    const budgetId = res.body.budget._id;

    const res2 = await request(app)
      .get(`/budgets/${budgetId}`)
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.budget.amount).toBe(1000);
  })
})

describe("PUT /budgets/:id", () => {
  it("should update a budget", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: 1000, startDate: "2023-01-01", endDate: "2023-12-31" });

    const budgetId = res.body.budget._id;

    const res2 = await request(app)
      .put(`/budgets/${budgetId}`)
      .set("Cookie", cookie)
      .send({ amount: 2000, startDate: "2023-01-01", endDate: "2023-12-31" });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.budget.amount).toBe(2000);
  })

  it("should return a 404 if no budget is found", async () => {
    let id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/budgets/${id}`)
      .set("Cookie", cookie)
      .send({ amount: 2000, startDate: "2023-01-01", endDate: "2023-12-31" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Budget not found");
  });

  it("should return a 400 if request body is invalid", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: 1000, startDate: "2023-01-01", endDate: "2023-12-31" });

    const budgetId = res.body.budget._id;

    const res2 = await request(app)
      .put(`/budgets/${budgetId}`)
      .set("Cookie", cookie)
      .send({ amount: "invalid", startDate: "2023-01-01", endDate: "2023-12-31" });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBeDefined();
  });
})

describe("DELETE /budgets/:id", () => {
  it("should delete a budget", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Cookie", cookie)
      .send({ amount: 1000, startDate: "2023-01-01", endDate: "2023-12-31" });

    const budgetId = res.body.budget._id;

    const res2 = await request(app)
      .delete(`/budgets/${budgetId}`)
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.message).toBe("Budget deleted successfully");
  })

  it("should return a 404 if no budget is found", async () => {
    let id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/budgets/${id}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Budget not found");
  });
});