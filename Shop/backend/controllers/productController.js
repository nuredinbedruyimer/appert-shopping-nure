const Product = require("../models/products");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
/* This is a function that creates a new product. admin api/v1/products*/
exports.newProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "Products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

/* This is a function that gets all the products in the database. */
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();
  const apifeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apifeatures.query;
  let filteredProductsCount = products.length;
  apifeatures.pagination(resPerPage);
  products = await apifeatures.query.clone();

  res.status(200).json({
    success: true,
    productCount,
    resPerPage,
    filteredProductsCount,
    products,
  });
});

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

/* This is a function that gets a single product by id. */
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

/* The above code is updating a single product. admin api/v1/products/:id*/
exports.updateSingleProduct = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    let product = await Product.findById(id);
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "Products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  
   product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    useValidators: true,
    useFindAndModify: false,
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

/* This is a function that deletes a single product. admin api/v1/products/:id */
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});
//create new reviews and update existing reviews
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    ratings: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewExist = product.reviews.find(
    (review) => review.user.toString() === req.user.id.toString()
  );
  if (isReviewExist) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user.id.toString()) {
        review.ratings = Number(rating);
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((total, review) => total + review.ratings, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});
//get all reviews for a product
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
//delete a review for a product
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numberOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.ratings + acc, 0) / reviews.length
console.log(reviews)
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numberOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})