import { City } from "../models";

class CityController {
  async create(req, res) {
    try {
      const form = req.body;
      const existingCity = await City.findOne({
        name: form.name,
        province_id: form.province_id,
      });

      if (existingCity) {
        return res.status(400).json({
          message: "City already exists",
        });
      }

      const data = await City.create(form);

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
      const { province_id } = req.query;
      const data = await City.findAll({
        where: {
          ...(province_id && { province_id }),
        },
        attributes: ["id", "name"],
      });
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
      const data = await City.findByPk(id, {
        attributes: ["id", "name"],
      });
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "City not found!",
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
      const data = await City.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "City not found!",
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
      const data = await City.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "City not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "City successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new CityController();
