const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


const router = express.Router();

const User = require('../../models/User')

const {
    check,
    validationResult
} = require('express-validator')

// @route POST api/users
// @desc Register user
// @access Public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', ' Please enter a password with 6 or more characters')
    .isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        //return an array of errors.
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let {
        name,
        email,
        password
    } = req.body;


    //TODO: figure out how to turn all emails to lowercase

    email.toLowerCase();

    try {

        let user = await User.findOne({
            email
        });

        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: 'User already exists!'
                }]
            });
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt the password 
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        //save user.
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            // TODO: Remember to change this to 3600 seconds for production.
            expiresIn: 36000
        }, (err, token) => {
            if (err) throw err
            res.json({
                token
            });
        });

    } catch (err) {

        console.log(err.message)
        res.status(500).send('Server Error')
    }
});

module.exports = router;