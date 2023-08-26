import { Position } from "../../models";
import sequelize from "../../models/sequelize";

class PositionWebController {
  async getAll(req, res) {
    try {
      const data = await Position.findAll({
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

  async create(req, res) {
    const form = req.body;
    const existingPosition = await Position.findOne({
      name: form.name,
    });
    if (existingPosition) {
      return res.status(400).json({
        message: "Position already exists",
      });
    }
    const positionsCount = await Position.count();

    if (positionsCount > 5) {
      const data = await Position.create(form);
      return res.status(200).json({
        message: "Position successfully created",
        data: data,
      });
    } else {
      return res.status(400).json({
        message: "Failed",
        error: "Cannot create position, minimum count requirement not met.",
      });
    }
  }

  async destroy(req, res) {
    try {
      const { position_id } = req.params;
      const data = await Position.findByPk(position_id);

      if (!data) {
        return res.status(404).json({
          message: "Failed",
          error: "Position not found!",
        });
      }

      const positionsCount = await Position.count();

      if (positionsCount > 5) {
        await data.destroy();
        return res.status(200).json({
          message: "Position successfully deleted",
        });
      } else {
        return res.status(400).json({
          message: "Failed",
          error: "Cannot delete position, minimum count requirement not met.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async createPositions(req, res) {
    const t = await sequelize.transaction();
    try {
      const positions = req.body;

      const positionsCount = await Position.count();

      if (positionsCount > 5) {
        for (let i = 0; i < positions.length; i++) {
          const el = positions[i];
          const payload = {
            name: el.name,
          };

          const dsa = await Position.create(payload, { transaction: t });
        }
        await t.commit();
        return res.status(200).json({
          message: "Position data successfully saved",
          data: dsa,
        });
      } else {
        return res.status(400).json({
          message: "Failed",
          error: "Cannot create position, minimum count requirement not met.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new PositionWebController();
