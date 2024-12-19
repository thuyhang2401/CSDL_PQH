const multer = require('multer'); // upload file
const path = require('path');

const Product = require('../models/product');
const SizeQuantity = require('../models/sizeQuantity');
const Category = require('../models/category');
const { ObjectId } = require('mongodb');

// Controller to fetch and display products
// Controller để lấy và hiển thị sản phẩm

exports.getHomePage = async (req, res) => {
  console.log("Start fetching products");
  
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',  // Tên collection của Category
          localField: 'categoryId',  // Trường categoryId trong Product
          foreignField: '_id',  // Trường _id trong Category
          as: 'category'  // Alias để lưu kết quả tìm thấy
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true  // Giữ lại sản phẩm không có danh mục
        }
      }
    ]);

    // Kiểm tra nếu dữ liệu đã được lấy thành công
    console.log("Fetched Products:", products); // In ra console để kiểm tra
    if (!products || products.length === 0) {
      console.log("Không có sản phẩm nào");
    }
    // Render trang chủ với dữ liệu sản phẩm
    res.render('index', { products }); // Truyền 'products' vào view
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
};
exports.getProducts = (req, res) => {
  Product.find()
    .populate('categoryId')
    .then((products) => {
      Category.find()
        .then((categories) => {
          res.render('products', {
            prods: products,
            categories: categories,
            title: 'Product'
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/images');
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
    res.redirect('/WebBanGiay/products');
  } catch (err) {
    console.log('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;

  Product.findById(productId)
      .populate('categoryId')
      .then((product) => {
          if (!product) {
              return res.status(404).render('404');
          }

          Promise.all([
              Category.find(),
              SizeQuantity.findOne({ productId: productId })
          ])
          .then(([categories, sizeQtt]) => {
              res.render('product-single', {
                  product: product,
                  categories: categories,
                  sizes: sizeQtt ? sizeQtt.sizes : null // Truyền kích thước
              });
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send('Có lỗi xảy ra');
          });
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Có lỗi xảy ra');
      });
};

exports.deleteProduct = async (req, res) => {
  const productId = req.body.pidDelete;

  try {
    await Product.deleteOne({ _id: productId });
    await SizeQuantity.deleteOne({ productId: productId });
    res.redirect('/WebBanGiay/products');
  } catch (error) {
    console.log(err)
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.body.pidEdit;
    const { productName, description, price, categoryId, color, storageInstruction, tips, image, oldImage } = req.body;
    let imageName;
    if (image) {
      imageName = image;
    } else {
      imageName = oldImage;
    }

    const quantities = [
      'amount35', 'amount36', 'amount37', 'amount38', 'amount39',
      'amount40', 'amount41', 'amount42', 'amount43', 'amount44', 'amount45'
    ];

    const totalQuantity = quantities.reduce((sum, quantityName) => {
      const quantity = parseInt(req.body[quantityName], 10) || 0;
      return sum + quantity;
    }, 0);

    // update product
    const product = await Product.findById(productId);

    product.productName = productName;
    product.description = description;
    product.price = price;
    product.quantity = totalQuantity;
    product.image = imageName;
    product.categoryId = categoryId;
    product.color = color;
    product.storageInstruction = storageInstruction;
    product.tips = tips;
    await product.save();

    // update sizeQuantity
    const sizeQuantitiesData = quantities.reduce((sizes, quantityName) => {
      const size = quantityName.replace('amount', 'size');
      sizes[size] = parseInt(req.body[quantityName], 10) || 0;
      return sizes;
    }, {});

    const sizeQuantity = await SizeQuantity.findOne({ productId: productId });

    sizeQuantity.sizes = sizeQuantitiesData;
    await sizeQuantity.save();

    res.redirect('/WebBanGiay/products');
  }
  catch (err) {
    console.error(err);
  }
};
