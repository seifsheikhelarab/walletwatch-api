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
  getOneExpense,
  updateOneExpense,
  deleteOneExpense
} from "./controllers/expense.controller.js";

import {
  getBudgets,
  setBudget,
  getOneBudget,
  updateOneBudget,
  deleteOneBudget
} from "./controllers/budget.controller.js";

import {
  getGoals,
  setGoal,
  getOneGoal,
  updateOneGoal,
  deleteOneGoal
} from "./controllers/goal.controller.js";

import {
  getReports,
  getNotifications
} from "./controllers/report.controller.js";

import {
  userErrorArray,
  expenseErrorArray,
  budgetErrorArray,
  goalErrorArray
} from "./middleware/validation.middleware.js";

import {
  isAuthenticated,
  isNotAuthenticated
} from "./middleware/auth.middleware.js";

import { authRateLimit } from "./config/ratelimit.config.js";

export const router = express.Router();

//Auth routes
router.post("/auth/register", authRateLimit, isNotAuthenticated, userErrorArray, registerController);
router.post("/auth/login", authRateLimit, isNotAuthenticated, userErrorArray, loginController);
router.post("/auth/logout", isAuthenticated, logoutController);
router.get('/auth/google', isNotAuthenticated, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallbackController);

// Expenses
router.route("/expenses")
  .get(isAuthenticated, getExpenses)
  .post(isAuthenticated, expenseErrorArray, addExpense);

router.route("/expenses/:id")
  .get(isAuthenticated, getOneExpense)
  .put(isAuthenticated, expenseErrorArray, updateOneExpense)
  .delete(isAuthenticated, deleteOneExpense);

// Budgets
router.route("/budgets")
  .get(isAuthenticated, getBudgets)
  .post(isAuthenticated, budgetErrorArray, setBudget);

router.route("/budgets/:id")
  .get(isAuthenticated, getOneBudget)
  .put(isAuthenticated, budgetErrorArray, updateOneBudget)
  .delete(isAuthenticated, deleteOneBudget);


// Goals
router.route("/goals")
  .get(isAuthenticated, getGoals)
  .post(isAuthenticated, goalErrorArray, setGoal);

router.route("/goals/:id")
  .get(isAuthenticated, getOneGoal)
  .put(isAuthenticated, goalErrorArray, updateOneGoal)
  .delete(isAuthenticated, deleteOneGoal);

//Reports and Notifications
router.get("/reports", isAuthenticated, getReports);
router.get("/notifications", isAuthenticated, getNotifications);