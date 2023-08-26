import { Job } from "../models";

class JobController {
  async create(req, res) {
    try {
      const form = req.body;
      const data = await Job.create(form);
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
      const data = await Job.findAll();
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
      const data = await Job.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Job not found!",
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
      const data = await Job.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Job not found!",
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
      const data = await Job.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Job not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Job successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new JobController();
