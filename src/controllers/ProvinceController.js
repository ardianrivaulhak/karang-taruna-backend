import { Province } from "../models";

class ProvinceController {
  async create(req, res) {
    try {
      const form = req.body;
      const existingProvince = await Province.findOne({ name: form.name });

      if (existingProvince) {
        return res.status(400).json({
          message: "Province already exists",
        });
      }
      const data = await Province.create(form);
      return res.status(201).json({
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

  async findAll(req, res) {
    try {
      const data = await Province.findAll({
        attributes: ["id", "name"],
      });
      console.log("masuk");
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

  async findById(req, res) {
    try {
      const { id } = req.params;
      const data = await Province.findByPk(id, {
        attributes: ["id", "name"],
      });
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Province not found!",
        });
      }
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

  async update(req, res) {
    try {
      const { id } = req.params;
      const form = req.body;
      const data = await Province.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Province not found!",
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
      const data = await Province.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Province not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Province successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new ProvinceController();
