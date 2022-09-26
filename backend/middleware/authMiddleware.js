import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

const protect = asyncHandler(async (req, res, next) => {
  let token
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        token = req.headers.authorization.split(' ')[1]                 //uzima prvi indeks sto je sam token bez Bearera - on je kao 0 ind

        const decoded = jwt.verify(token, process.env.JWT_SECRET)       //drugi param je lozinka

        req.user = await User.findById(decoded.id).select('-password')  //uzimamo userov id iz konzole

        next()

    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error ('Nema autorizacije, los token!')
    }
  }

  if (!token){
    res.status(401)
    throw new Error ('Bez autorizacije, nema tokena!')
  }

})


const admin = ( req, res, next) => {
  if(req.user && req.user.isAdmin){
    next()
  } else {
    res.status(401)
    throw new Error ('Niste autorizovani kao admin!')
  }
}

export {protect, admin}