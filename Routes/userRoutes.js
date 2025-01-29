import express from "express";
import { Auth, loginUser, registerUser } from "../controller/userController.js";
import { body } from 'express-validator'
import { VerifyUser } from "../middleware/verifyuser.js";
import { createContact, deleteContact, getContact, getContacts, updateContact } from "../controller/contactController.js";


const router = express.Router();

//user routes 

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name should not be empty'),
  body('email').trim().notEmpty().withMessage("Email should not be empty").isEmail().withMessage('invalid email'),
  body('password').trim().notEmpty().withMessage('Password should not be empty').isLength({ min: 5, max: 30 }).withMessage('password should be betweeen 5 and 30')

], registerUser)


router.post('/login', (req, res, next) => {
  console.log("Login endpoint hit");
  next();
}, [
  body('email').trim().notEmpty().withMessage("Email should not be empty").isEmail().withMessage('Invalid email'),
  body('password').trim().notEmpty().withMessage('Password should not be empty').isLength({ min: 5, max: 30 }).withMessage('Password should be between 5 and 30 characters')
], loginUser);

router.get('/verify', VerifyUser, Auth)


//contact routes 

router.post('/add-contact', VerifyUser, createContact)
router.get('/contacts', VerifyUser, getContacts)
router.get('/contact/:id', VerifyUser, getContact)
router.put('/update-contact/:id', VerifyUser, updateContact)
router.delete('/delete-contact/:id', VerifyUser, deleteContact);



export default router;