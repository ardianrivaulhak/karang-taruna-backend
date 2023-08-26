import { Category } from "../models";
import sequelize from "../models/sequelize";

class CategoryController {
  async getCategories(req, res) {
    try {
      const categories = await Category.findAll({
        attributes: ["id", "name"],
      });

      res.status(200).json({
        message: "Success Read Data",
        data: categories,
      });
    } catch (error) {
      console.log("Failed Read Data", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async detailCategory(req, res) {
    try {
      const { category_id } = req.params;
      const category = await Category.findByPk(category_id, {
        attributes: ["name"],
      });

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      res.status(200).json({
        message: "Success Read Data",
        data: category,
      });
    } catch (error) {
      console.log("Failed Read Data", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async createCategory(req, res) {
    const t = await sequelize.transaction();

    try {
      const { name } = req.body;

      const createCategory = await Category.create(
        { name },
        { transaction: t }
      );

      await t.commit();
      res.status(200).json({
        message: "Success Create Data",
        data: createCategory,
      });
    } catch (error) {
      await t.rollback();

      console.log("Failed Create Data", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const { category_id } = req.params;
      const { name } = req.body;

      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      category.name = name;
      await category.save();

      res.status(200).json({
        message: "Success Update Data",
        data: category,
      });
    } catch (error) {
      console.log("Failed Update Data", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async destroyCategory(req, res) {
    try {
      const { category_id } = req.params;

      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      await category.destroy();

      res.status(200).json({
        message: "Category deleted successfully",
        data: category,
      });
    } catch (error) {
      console.log("Failed to delete category", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export default new CategoryController();
