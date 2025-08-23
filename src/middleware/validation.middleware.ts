import { Request, Response } from 'express';
import { check } from 'express-validator';

export const errorArray = [
  check("name", "Invalid Name")
    .matches(/^[a-zA-Z ]+$/)
    .isLength({ min: 3, max: 50 }),
  
  check("email", "Invalid Email")
    .isEmail(),
  
  check("password")
    .optional({ nullable: true })
    .isLength({ min: 8, max: 64 }).withMessage("Invalid Password length")
    .matches(/\d/).withMessage("No digit in Password")
    .matches(/[A-Z]/).withMessage("No Uppercase letter in Password")
    .matches(/[a-z]/).withMessage("No Lowercase letter in Password"),
  
  check("income", "Income must be a number")
    .isNumeric()
    .custom((value) => value >= 0).withMessage("Income must be non-negative"),
  
  check("oauth").
    optional({ nullable: true })
    .isIn(['google', null])
    .withMessage("Invalid OAuth provider"),
];
