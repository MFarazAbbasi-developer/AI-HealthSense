import express from 'express';
import upload from '../middlewares/multer.js';
import { addDoctor, allDoctors, addReview, adminLogin, deleteDoctor, deleteReview, sendMessage } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor', upload.single('doctorImageUrl'), addDoctor)
adminRouter.get('/all-doctors', allDoctors)


// Testing for review
adminRouter.post('/add-review', addReview)


// For updating doctor images
import { updateDoctorImageUrls } from '../controllers/adminController.js';
adminRouter.put('/update-doctor-images', updateDoctorImageUrls);
// For updating doctor password
import { addPreHashedPasswordToDoctors } from '../controllers/adminController.js';
adminRouter.put('/add-pre-hashed-password', addPreHashedPasswordToDoctors);


// For Editing doctor information by doctor
import { updateDoctorProfile } from '../controllers/adminController.js';
import userAuth from '../middlewares/userAuth.js';
adminRouter.put('/update-profile', userAuth, updateDoctorProfile);


// For Admin Login
adminRouter.post('/login', adminLogin)

// For Deleting particular doctor by Admin
import isAdmin from '../middlewares/isAdmin.js';
adminRouter.delete('/delete-doctor/:id', userAuth, isAdmin, deleteDoctor)
adminRouter.delete('/delete-review/:id', userAuth, isAdmin, deleteReview)


// For Contact Us Form
adminRouter.post('/send-message', sendMessage)


export default adminRouter;