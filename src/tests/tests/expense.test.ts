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

  const befRes = await request(app)
    .post("/auth/register")
    .send({
      name: "John Doe",
      email: "user@gmail.com",
      password: "Pass1234",
      income: 7000,
    });

  cookie = befRes.headers["set-cookie"];
});

describe("POST /expenses", () => {

  it("should create a new expense", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: 1000, category: "Transportation", description: "Gas for car" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Expense added successfully");
  });

  it("should return 400 if request body is invalid", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: "invalid", category: "Transportation", description: "Gas for car" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});

describe("GET /expenses", () => {
  it("should return a 404 if no expenses are found", async () => {
    const res = await request(app)
      .get("/expenses")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No expenses found");
  });

  it("should return a list of expenses", async () => {
    await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: 1000, category: "Transportation", description: "Gas for car" });

    const res = await request(app)
      .get("/expenses")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.expenses.length).toBe(1);
  })
});

describe("GET /expenses/:id", () => {
  it("should return a 404 if no expense is found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/expenses/${id}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Expense not found");
  });

  it("should return an expense", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: 1000, category: "Transportation", description: "Gas for car" });

    const expenseId = res.body.expense._id;

    const res2 = await request(app)
      .get(`/expenses/${expenseId}`)
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.expense.amount).toBe(1000);
  })
});

describe("PUT /expenses/:id", () => {
  it("should update an expense", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: 1000, category: "Transportation", description: "Gas for car" });

    const expenseId = res.body.expense._id;

    const res2 = await request(app)
      .put(`/expenses/${expenseId}`)
      .set("Cookie", cookie)
      .send({ amount: 2000, category: "Transportation", description: "Gas for car" });

    expect(res2.statusCode).toBe(200);
    expect(res2.body.expense.amount).toBe(1000);
  })

  it("should return a 404 if no expense is found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/expenses/${id}`)
      .set("Cookie", cookie)
      .send({ amount: 2000, category: "Transportation", description: "Gas for car" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Expense not found");
  });

  it("should return 400 if request body is invalid", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: 1000, category: "Transportation", description: "Gas for car" });

    const expenseId = res.body.expense._id;

    const res2 = await request(app)
      .put(`/expenses/${expenseId}`)
      .set("Cookie", cookie)
      .send({ amount: "invalid", category: "Transportation", description: "Gas for car" });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBeDefined();
  });
});

describe("DELETE /expenses/:id", () => {
  it("should delete an expense", async () => {
    const res = await request(app)
      .post("/expenses")
      .set("Cookie", cookie)
      .send({ amount: 1000, category: "Transportation", description: "Gas for car" });

    const expenseId = res.body.expense._id;

    const res2 = await request(app)
      .delete(`/expenses/${expenseId}`)
      .set("Cookie", cookie);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.message).toBe("Expense deleted successfully");
  })

  it("should return a 404 if no expense is found", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/expenses/${id}`)
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Expense not found");
  });
});
