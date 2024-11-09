const multer = require('multer'); // upload file
const path = require('path');

const Product = require('../../models/product');
const SizeQuantity = require('../../models/sizeQuantity');
const Category = require('../../models/category');

exports.getProducts = (req, res) => {
  Product.find()
    .populate('categoryId')
    .then((products) => {
      Category.find()
        .then((categories) => {
          res.render('index-admin', {
            prods: products,
            categories: categories,
            title: 'Admin Dashboard'
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

exports.addProduct = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single('image')(req, res, (err) => {
        if (err) {
          console.log('File upload error:', err);
          return res.status(500).send('Error uploading file');
        }
        resolve();
      });
    });

    const { productName, description, price, categoryId, color, storageInstruction, tips } = req.body;
    let imageName = req.file ? req.file.filename : null;

    const quantities = [
      'amount35', 'amount36', 'amount37', 'amount38', 'amount39',
      'amount40', 'amount41', 'amount42', 'amount43', 'amount44', 'amount45'
    ];

    const totalQuantity = quantities.reduce((sum, quantityName) => {
      const quantity = parseInt(req.body[quantityName], 10) || 0;
      return sum + quantity;
    }, 0);

    const latestProduct = await Product.findOne().sort({ _id: -1 });
    const productId = latestProduct._id + 1;

    // create the new product
    const product = new Product({
      _id: productId,
      productName: productName,
      description: description,
      price: price,
      quantity: totalQuantity,
      image: imageName,
      categoryId: categoryId,
      color: color,
      storageInstruction: storageInstruction,
      tips: tips,
    });

    await product.save();

    // create the new sizeQuantity
    const sizeQuantitiesData = quantities.reduce((sizes, quantityName) => {
      const size = quantityName.replace('amount', 'size');
      sizes[size] = parseInt(req.body[quantityName], 10) || 0;
      return sizes;
    }, {});

    const latestSizeQuantity = await SizeQuantity.findOne().sort({ _id: -1 });
    const sizeQuantityId = latestSizeQuantity._id + 1;

    const sizeQuantity = new SizeQuantity({
      _id: sizeQuantityId,
      productId: productId,
      sizes: sizeQuantitiesData,
    });

    await sizeQuantity.save();
    res.redirect('/admins/products');
  } catch (err) {
    console.log('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .populate('categoryId')
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      Category.find()
        .then((categories) => {
          SizeQuantity.find({ productId: productId })
            .then((sizeQtt) => {
              res.json({
                product: product,
                category: categories,
                sizeQtt: sizeQtt,
              });
            })
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};