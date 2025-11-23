const express = require('express');
const superAdminController = require('../../controllers/superAdmin.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

// router.post('/register', superAdminController.register);
// router.post('/login', superAdminController.login);

router.post('/accounts', auth('SUPERADMIN'), superAdminController.createAccount);
router.get('/accounts', auth('SUPERADMIN'), superAdminController.getAccounts);
router.put('/accounts/:accountId', auth('SUPERADMIN'), superAdminController.updateAccount);
router.delete('/accounts/:accountId', auth('SUPERADMIN'), superAdminController.deleteAccount);

module.exports = router;
