import supertest from "supertest"
import serverSetup from "../config/server.config.ts"

const app = serverSetup();

jest.mock("../config/session.config.ts", () => ({

}))

describe('test', () => {

  describe('get expense route', () => {

    describe("given the expense does not exist", () => {

      it("should return a 500", async () => {
        const expenseId = "1234";
        await supertest(app).get(`/expenses/${expenseId}`).expect(500);
      })

    })

  })

})