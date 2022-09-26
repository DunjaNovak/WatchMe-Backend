import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'


// @desc    Create new order
// @route   POST /api/orders
// @access  Private

//upit i odgovor
const addOrderItems = asyncHandler(async (req, res) => {
      const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body
//niz prazan ili ne postoji
    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('Nema Proizvoda')
        return
    } else {
        const order = new Order({
            orderItems, 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)//json file

    }
   
})


// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Priavte
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
//params samo proveri da li id bas
    if(order) {
        res.json(order)
    }else {
        res.status(404)
        throw new Error('Porudzbina nije pronadjena')
    }
})//MORAMO DA SE VRATIMO IM I MEJL USERA


// @desc    Get logged in user orders
// @route   GET /api/orders/:id/myorders bez id
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    res.json(orders)
  })
  
    // @desc    Get logged in user orders
  // @route   GET /api/orders/:id/myorders bez id
  // @access  Private
  const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
  })

  // @desc    Update order to deliverd
  // @route   GET /api/orders/:id/deliver
  // @access  Private/Admin
  const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
  
    if (order) {
      order.isDelivered= true,
      order.deliveredAt = Date.now()
      
      const updatedOrder = await order.save()
      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Porudzbina nije pronadjena')
    }
  })

  
  export {addOrderItems, getOrderById, /*updateOrderToPaid,*/ getMyOrders, getOrders, updateOrderToDelivered}

