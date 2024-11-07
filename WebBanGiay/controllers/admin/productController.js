const multer = require('multer'); // upload file
const path = require('path');

const Product = require('../../models/product');
const SizeQuantities = require('../../models/sizeQuantity');
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

exports.addProduct = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.log('File upload error:', err);
      return res.status(500).send('Error uploading file');
    }

    // insert collection products
    Product.findOne().sort({ _id: -1 })
      .then((lastestProduct) => {
        const productId = lastestProduct._id + 1;
        const { productName, description, price, categoryId, color, storageInstruction, tips } = req.body;
        const image = req.file ? req.file.filename : null;

        const quantities = [
          'amount35', 'amount36', 'amount37', 'amount38', 'amount39',
          'amount40', 'amount41', 'amount42', 'amount43', 'amount44', 'amount45'
        ];

        const totalQuantity = quantities.reduce((sum, quantityName) => {
          const quantity = parseInt(req.body[quantityName], 10) || 0;
          return sum + quantity;
        }, 0);

        const product = new Product({
          _id: productId,
          productName: productName,
          description: description,
          price: price,
          quantity: totalQuantity,
          image: image,
          categoryId: categoryId,
          color: color,
          storageInstruction: storageInstruction,
          tips: tips,
        });

        product.save();

        // insert collection sizeQuantity
        SizeQuantities.findOne().sort({ _id: -1 })
          .then((lastestSizePr) => {
            const sizeQuantityId = lastestSizePr._id + 1;
            const productId = product._id;

            const sizeQtt = quantities.reduce((sizes, quantityName) => {
              const size = quantityName.replace('amount', 'size');
              sizes[size] = parseInt(req.body[quantityName], 10) || 0;
              return sizes;
            }, {});

            const sizeQuantity = new SizeQuantities({
              _id: sizeQuantityId,
              productId: productId,
              sizes: sizeQtt,
            });

            sizeQuantity.save();
          });

        res.redirect('/admins/products');
      })
      .catch((err) => {
        console.log('Error fetching latest product:', err);
      });
  });
};