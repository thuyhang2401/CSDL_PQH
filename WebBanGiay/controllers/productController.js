const Product = require('../models/product');
const SizeQuantity = require('../models/sizeQuantity');
const Category = require('../models/category');
const Cart = require('../models/cart');
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

    const userId = req.session.userId;
    const cart = await Cart.where('accountId').equals(userId).exec();
    const count = cart.length;

    console.log(userId);
    console.log(cart);

    // Render trang chủ với dữ liệu sản phẩm
    res.render('index', { products, count }); // Truyền 'products' vào view
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getProducts = async (req, res) => {
  
  const userId = req.session.userId;
  const cart = await Cart.where('accountId').equals(userId).exec();
  const count = cart.length;

  console.log(userId);
  console.log(count);

  Product.find()
    .populate('categoryId')
    .then((products) => {
      Category.find()
        .then((categories) => {
          res.render('products', {
            prods: products,
            categories: categories,
            count: count,
            title: 'Product'
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getProductById = async (req, res) => {
  const userId = req.session.userId;
  const cart = await Cart.where('accountId').equals(userId).exec();
  const count = cart.length;

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
            sizes: sizeQtt ? sizeQtt.sizes : null, // Truyền kích thước
            count: count
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