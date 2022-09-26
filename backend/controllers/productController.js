import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'


// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
      
        const products = await Product.find({})
     
        res.json(products)
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
      
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error('Proizvod nije pronadjen')
    }
})
// @desc Delete product
// @route DELETE /api/products/:id
// @desc Private/Admin

const deleteProduct = asyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id)

  if(product){
      await product.remove()
     res.json({message: 'Proizvod obrisan!'}) 
  } else {
      res.status(404)
      throw new Error ('Proizvod nije pronadjen')
  }
})

// @desc Create product
// @route POST /api/products/:id
// @desc Private/Admin

const createProduct = asyncHandler(async(req, res) => {
  const product = new Product ({
      name: 'Proizvod',
      price: 0,
      user: req.user._id,
      image: 'images/primer.jpg',
      conutInStock: 0,
      category: "kategorija",
      brand: "brend",
      description: 'Opis proizvoda'
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})



// @desc Update product
// @route PUT /api/products/:id
// @desc Private/Admin

const updateProduct = asyncHandler(async(req, res) => {
  const {name, price, image, brand, category, description, conutInStock} = req.body

  const product = await Product.findById(req.params.id)

  if(product){
      product.name = name
      product.image = image
      product.price = price
      product.brand= brand
      product.category = category
      product.conutInStock = conutInStock
      product.description = description

      const updatedProduct = await product.save()
      res.status(201).json(updatedProduct)
  } else {
      res.status(404)
      throw new Error('Proizvod nije pronadjen')
  }
})


export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct
}