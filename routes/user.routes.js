const express = require("express");
const router = express.Router();
const AppError = require("../utils/AppError");
const Joi = require("joi");
const userController = require("../controllers/user.controller");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validate = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(new AppError(error.details[0].message, 400, error.details));
  }
  next();
};

// REST API endpoints
router.post("/", validate, userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
module.exports = router;
