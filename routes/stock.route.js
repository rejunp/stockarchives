const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const stock_controller = require('../controllers/stock.controller');

//API's
router.get('/api/getstocks',stock_controller.get_all_stocks);
router.get('/api/getsymbollist',stock_controller.get_symbol_list);
router.post('/api/getstockbyname',stock_controller.get_symbol_by_name);

//home
router.get('*',stock_controller.stock_ui_home);

// a simple test url to check that all of our files are communicating correctly.
//router.get('/test', stock_controller.test);

//CURD
//router.post('/create', stock_controller.stock_create);
//router.get('/:id', stock_controller.stock_details);
//router.put('/:id/update', stock_controller.stock_update);
//router.delete('/:id/delete', stock_controller.stock_delete);

/*//csv upload
router.get('/upload', stock_controller.stock_home);
router.get('/template', stock_controller.get_template);
router.post('/upload', stock_controller.stock_upload);*/


module.exports = router;
