const Product = require('../models/product'); 
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
