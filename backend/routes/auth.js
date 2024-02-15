const express = require('express');
const User = require('../Models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator')

// Create a User using : POST: "/api/auth". Does'nt require Auth
router.post('/createuser', [
    // creating check vadilation for user credentials like name, email and password  
    // Name must be at least 3 chars long
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    // Email must be an email
    body('email', 'Enter a valid email').isEmail(),
    // Password must be at least 5 chars long
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    // For request into the body - Go to thunderclient and select in header the content type and application/json
    // console.log(req.body)    
    // const user = User(req.body)
    // user.save()


    try {
        // If there are errors, return Bad request and the erors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return a status 400 and return json of error in the array form
            return res.status(400).json({ errors: errors.array() });
        }
        // Create a new user. This code return a promise --> Check whether the user with this mail exists already 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        user = await User.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        })
        res.json(user)
    } 
    catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
    // // Takes user argument send response json of user --> When creates a new user
    // .then((user) => res.json(user)).
    // catch((error)=>{
    //     // If user existing then send the error
    //     {console.log(error)
    //     // Send the error in json (error, message) --> If user existing
    //     res.json({error: "Please Enter an unique value for email", message: error.message})}
    // })
})

module.exports = router 