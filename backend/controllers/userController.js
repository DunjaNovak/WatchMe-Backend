import asyncHandler from 'express-async-handler'
//import { useRouteMatch } from 'react-router-dom'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc Authentication user and get token
// @route POST /api/users/login
// @desc Public

const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({ email })    //proverava da li je poslati email prepoznat, da li je to bas taj

    if (user && (await user.matchPassword(password))) {                                   //ako user postoji proverava da li je proslednjena lozinka tacma bas za tog usera
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        }) 
    } else {
            res.status(401)    
            throw new Error ('Pogresan email ili lozinka')
        }
    }
)


// @desc Register a new user
// @route POST /api/users
// @desc Public

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body

    const userExists = await User.findOne({ email })    

    if (userExists) {
        res.status(400)
        throw new Error('Korisnik vec postoji')
    }
    
    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Nevalidni podaci')
    }
    
})




// @desc Get user profile
// @route GET /api/users/profile
// @desc Private

const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }) 
    } else {
        res.status(401)
        throw new Error ('Korisnik nije pronadjen')
    }
})



// @desc Update user profile
// @route PUT /api/users/profile
// @desc Private

const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name 
        user.email = req.body.email || user.email
        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(401)
        throw new Error ('Korisnik nije pronadjen')
    }
})



// @desc Get user profile
// @route GET /api/users
// @desc Private/Admin

const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({})
    res.json(users)
})



// @desc Delete user 
// @route DELETE /api/users/:id
// @desc Private/Admin

const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)
    
    if(user){
        await user.remove()
        res.json({message: 'Korisnik je obrisan!'})
    } else {
        res.status(404)
        throw new Error ('Korisnik nije pronadjen')
    }
})



// @desc Get user by ID
// @route GET /api/users/:id
// @desc Private/Admin

const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
    }else {
        res.status(404)
        throw new Error ('Korisnik nije pronadjen')
    }
})



// @desc Update user 
// @route PUT /api/users/:id
// @desc Private/Admin

const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)

    if(user){
        user.name = req.body.name || user.name 
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin 

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(401)
        throw new Error ('Korisnik nije pronadjen')
    }
})


export {authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser}
