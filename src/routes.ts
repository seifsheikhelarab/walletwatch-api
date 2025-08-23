import express from "express";
import passport from "passport";

import {
  registerController,
  loginController,
  logoutController,
  googleCallbackController
} from "./controllers/auth.controller.js";

import {
  getExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "./controllers/expense.controller.js";

import {
  getBudgets,
  setBudget,
  getGoals,
  setGoal
} from "./controllers/budget.controller.js";

import {
  getReports,
  getNotifications
} from "./controllers/report.controller.js";

import { errorArray } from "./middleware/validation.middleware.js";
import { isAuthenticated } from "./middleware/authentication.middleware.js";

export const router = express.Router();

//Auth routes
router.post("/auth/register", errorArray, registerController);
router.post("/auth/login", errorArray, loginController);
router.post("/auth/logout", isAuthenticated, logoutController);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallbackController);

//Expenses
router.route("/expenses")
  .get(isAuthenticated, getExpenses)
  .post(isAuthenticated, addExpense);

router.route("/expenses/:id")
  .get(isAuthenticated, getExpenseById)
  .put(isAuthenticated, updateExpense)
  .delete(isAuthenticated, deleteExpense);

//Budgets
router.route("/budgets")
  .get(isAuthenticated, getBudgets)
  .post(isAuthenticated, setBudget);

router.route("/goals")
  .get(isAuthenticated, getGoals)
  .post(isAuthenticated, setGoal);

//Reports and Notifications
router.get("/reports", isAuthenticated, getReports);
router.get("/notifications", isAuthenticated, getNotifications);