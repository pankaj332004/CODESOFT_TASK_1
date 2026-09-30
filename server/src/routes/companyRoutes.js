const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyByName,
} = require('../controllers/companyController');

router.get('/', getCompanies);
router.get('/:name', getCompanyByName);

module.exports = router;
