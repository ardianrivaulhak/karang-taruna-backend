import { Op } from "sequelize";
import { Branch } from "../models";

class BranchController {
  async create(req, res) {
    try {
      const form = req.body;
      const branch = await Branch.create(form);
      return res.status(201).json({
        message: "success",
        data: branch,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async findAll(req, res) {
    try {
      const { search = "" } = req.query;
      const branch = await Branch.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
      return res.status(200).json({
        message: "success",
        data: branch,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const branch = await Branch.findByPk(id);
      if (!branch) {
        return res.status(404).json({
          message: "failed",
          error: "Branch not found!",
        });
      }
      return res.status(200).json({
        message: "success",
        data: branch,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const form = req.body;
      const data = await Branch.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Branch not found!",
        });
      }
      await data.update(form);
      await data.reload();
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const data = await Branch.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Branch not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Branch successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new BranchController();
