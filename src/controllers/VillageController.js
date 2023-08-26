import { Village } from "../models";

class VillageController {
  async create(req, res) {
    try {
      const form = req.body;
      const existingVillage = await Village.findOne({
        name: form.name,
        district_id: form.district_id,
      });

      if (existingVillage) {
        return res.status(400).json({
          message: "Village already exists",
        });
      }
      const data = await Village.create(form);
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
      const { district_id } = req.query;
      const data = await Village.findAll({
        where: {
          ...(district_id && { district_id }),
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
      const data = await Village.findByPk(id, {
        attributes: ["id", "name"],
      });
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Village not found!",
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
      const data = await Village.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Village not found!",
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
      const data = await Village.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Village not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Village successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new VillageController();
