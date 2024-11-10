// import express from "express";
// import { login } from "../controllers/Auth";
// import { signup } from "../controllers/AdminAuth";

const express = require("express");
const {login,signup} = require("../controllers/AdminAuth")
const {createEmployee, editEmployee, getEmployees, deleteEmployee, getEmployeeById} = require("../controllers/Employee")

const { auth } = require("../middlewares/auth")

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.post("/createEmployee", auth, createEmployee);
router.post("/editEmployee/:id", auth, editEmployee);
router.get("/getAllEmployee", auth, getEmployees);
router.delete("/deleteEmployee/:id", auth, deleteEmployee);
router.get("/getemployeeById/:id",auth,getEmployeeById);

module.exports = router;