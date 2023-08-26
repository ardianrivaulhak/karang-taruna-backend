import { District } from "../models";

class DistrictController {
  async create(req, res) {
    try {
      const form = req.body;
      const existingDistrict = await District.findOne({
        name: form.name,
        city_id: form.city_id,
      });

      if (existingDistrict) {
        return res.status(400).json({
          message: "District already exists",
        });
      }
      const data = await District.create(form);
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
      const { city_id } = req.query;
      const data = await District.findAll({
        where: {
          ...(city_id && { city_id }),
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
      const data = await District.findByPk(id, {
        attributes: ["id", "name"],
      });
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "District not found!",
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
      const data = await District.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "District not found!",
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
      const data = await District.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "District not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "District successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new DistrictController();
