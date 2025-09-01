import express from "express";
import passport from "passport";

import {
  registerController,
  loginController,
  logoutController,
  googleCallbackController
} from "./controllers/auth.controller.ts";

import {
  getExpenses,
  addExpense,
  getOneExpense,
  updateOneExpense,
  deleteOneExpense
} from "./controllers/expense.controller.ts";

import {
  getBudgets,
  setBudget,
  getOneBudget,
  updateOneBudget,
  deleteOneBudget
} from "./controllers/budget.controller.ts";

import {
  getGoals,
  setGoal,
  getOneGoal,
  updateOneGoal,
  deleteOneGoal
} from "./controllers/goal.controller.ts";

import {
  getReports,
  getNotifications
} from "./controllers/report.controller.ts";

import { errorArray } from "./middleware/validation.middleware.ts";
import { isAuthenticated, isNotAuthenticated } from "./middleware/auth.middleware.ts";

export const router = express.Router();

//Auth routes
router.post("/auth/register",isNotAuthenticated, errorArray, registerController);
router.post("/auth/login",isNotAuthenticated, errorArray, loginController);
router.post("/auth/logout", isAuthenticated, logoutController);
router.get('/auth/google',isNotAuthenticated, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), googleCallbackController);

// Expenses
router.route("/expenses")
  .get(isAuthenticated, getExpenses)
  .post(isAuthenticated, addExpense);

router.route("/expenses/:id")
  .get(isAuthenticated, getOneExpense)
  .put(isAuthenticated, updateOneExpense)
  .delete(isAuthenticated, deleteOneExpense);

// Budgets
router.route("/budgets")
  .get(isAuthenticated, getBudgets)
  .post(isAuthenticated, setBudget);

router.route("/budgets/:id")
  .get(isAuthenticated, getOneBudget)
  .put(isAuthenticated, updateOneBudget)
  .delete(isAuthenticated, deleteOneBudget);


// Goals
router.route("/goals")
  .get(isAuthenticated, getGoals)
  .post(isAuthenticated, setGoal);

router.route("/goals/:id")
  .get(isAuthenticated, getOneGoal)
  .put(isAuthenticated, updateOneGoal)
  .delete(isAuthenticated, deleteOneGoal);

//Reports and Notifications
router.get("/reports", isAuthenticated, getReports);
router.get("/notifications", isAuthenticated, getNotifications);