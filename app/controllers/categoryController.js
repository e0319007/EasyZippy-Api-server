const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');
const CategoryService = require('../services/categoryService');

module.exports = {
    createCategory: async(req, res) => {
        try {
            const CategoryData = req.body;
            let category;
            await sequelize.transaction(async (transaction) => {
                category = await categoryService.createCategory(categoryData, transaction);
            });
            return res.status(200).send(category);
        } catch (err) {
            sendErrorResponse(res, err);
        }
    },

    retrieveCategory: async(req, res) => {
        try {
            const { id } = req.params;
            let category = await CategoryService.retrieveCategory(id);
            return res.status(200).send(category);
        } catch (err) {
            sendErrorResponse(res, err);
        }
    },

    retrieveAllCategory: async(req, res) => {
        try {
            let categories = await CategoryService.retrieveAllCategory();
            return res.status(200).send(categories);
        } catch (err) {
            sendErrorResponse(res, err);
        }
    },

    updateCategory: async(req, res) => {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            let category;
            await sequelize.transaction(async (transaction) => {
                category = await CategoryService.updateCategory(id, categoryData, transaction);
            });
            return res.status(200).send(category);
        } catch (err) {
            sendErrorResponse(res, err);
        }
    },

    deleteCategory: async(req, res) => {
        try {
            const { id } = req.params;
            await sequelize.transaction(async(transaction) => {
                CategoryService.deleteCategory(id, transaction);
            }) 
            return res.status(200).send();
        } catch (err) {
            sendErrorResponse(res, err);
        }
    }
}