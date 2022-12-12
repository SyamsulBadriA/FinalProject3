const CategoriesControllers = require('../controllers/categoriesControllers');
const ProductControllers = require('../controllers/productControllers');
const TransactionController = require('../controllers/transactionControllers');
const UserController = require('../controllers/userControllers');
const authentication = require('../middlewares/authentication');
const Authorization = require('../middlewares/authorization');

const router = require('express').Router();

router.post('/users/register', UserController.register);
router.post('/users/login', UserController.login);

router.use(authentication);

router.patch('/users/topup', UserController.topUpBalance);
router.use('/users/:id', Authorization.authorizeUser);
router.put('/users/:id', UserController.updateUserbyId);
router.delete('/users/:id', UserController.deleteUserbyId);

router.use('/categories', Authorization.authorizeAdmin);
router.post('/categories', CategoriesControllers.createCategory);
router.get('/categories', CategoriesControllers.getCategories);
router.patch('/categories/:categoryId', CategoriesControllers.patchCategory);
router.delete('/categories/:categoryId', CategoriesControllers.deleteCategory);

router.get('/products', ProductControllers.getProducts);
router.use('/products', Authorization.authorizeAdmin);
router.post('/products', ProductControllers.createProduct);
router.put('/products/:productId', ProductControllers.updateProductbyId);
router.patch('/products/:productId', ProductControllers.patchCategoryProduct);
router.delete('/products/:productId', ProductControllers.deleteProductById);

router.post('/transactions', TransactionController.makeTransaction);
router.get('/transactions/user', TransactionController.getTransactionHistoryUser);

router.use('/transactions/admin', Authorization.authorizeAdmin);
router.get('/transactions/admin', TransactionController.getTransactionHistoryAdmin);
router.get('/transactions/:transactionId', TransactionController.getTransactionHistorybyId);

module.exports = router;