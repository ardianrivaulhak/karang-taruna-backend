import { Record } from "../models";

class RecordController {
  async create(req, res) {
    try {
      const form = req.body;
      const data = await Record.create(form);
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
      const data = await Record.findAll();
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

  async findByName(req, res) {
    try {
      const { name } = req.query;
      const record = await Record.findOne({
        where: { name },
        attributes: ["id", "name", "body"],
      });
      return res.status(200).json({
        message: "Success",
        data: record,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const data = await Record.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Record not found!",
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
      const data = await Record.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Record not found!",
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
      const data = await Record.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Record not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Record successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new RecordController();
