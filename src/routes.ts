import express from "express";
import passport from "passport";

import {
  registerController,
  loginController,
  googleCallbackController
} from "./controllers/auth.controller.js";

import {
  getExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "./controllers/budget.controller.js";

import {
  getBudgets,
  setBudget,
  getGoals,
  setGoal
} from "./controllers/expenses.controller.js";

import {
  getWeeklyReports,
  getMonthlyReports,
  getNotifications
} from "./controllers/report.controller.js";

export const router = express.Router();

//Auth routes
router.post("/auth/register", registerController);
router.post("/auth/login", loginController);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallbackController);

//Expenses
router.route("/expenses")
  .get(getExpenses)
  .post(addExpense);

router.route("/expenses/:id")
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

//Budgets
router.route("/budgets")
  .get(getBudgets)
  .post(setBudget);

router.route("/goals")
  .get(getGoals)
  .post(setGoal);

//Reports and Notifications
router.get("/reports/weekly", getWeeklyReports);
router.get("/reports/monthly", getMonthlyReports);
router.get("/notifications", getNotifications);