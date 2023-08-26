import { Position } from "../models";

class PositionController {
  async createPosition(req, res) {
    try {
      const forms = req.body;
      const positions = await Position.bulkCreate(forms);

      return res.status(201).json({
        message: "Success",
        data: positions,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async findAll(req, res) {
    try {
      const data = await Position.findAll();
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
      const data = await Position.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Position not found!",
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
      const data = await Position.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Position not found!",
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
      const data = await Position.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Position not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Position successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new PositionController();
