import { Potential, SurverPotential, Survey, User } from "../models";

class SurveyController {
  async create(req, res) {
    try {
      const {
        potential_explanation,
        expectation,
        issue,
        criticism_and_suggestion,
        potential_id,
      } = req.body;

      const memberId = req.auth.user.Member.id;

      const user = await User.findByPk(req.auth.user.id);

      if (user.first_login) {
        const newSurvey = {
          member_id: memberId,
          potential_explanation,
          expectation,
          issue,
          criticism_and_suggestion,
        };

        const data = await Survey.create(newSurvey);

        await user.update({ first_login: false });

        potential_id.forEach(async (el) => {
          await SurverPotential.create({
            survey_id: data.id,
            potential_id: el,
          });
        });

        return res.status(201).json({
          message: "Success",
          data,
        });
      } else {
        return res.status(400).json({
          message: "Failed",
          error:
            "Cannot create survey. User has already completed the first login process.",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async findAll(req, res) {
    try {
      const data = await Survey.findAll({
        include: {
          model: Potential,
        },
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
      const data = await Survey.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Survey not found!",
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
      const data = await Survey.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Survey not found!",
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
      const data = await Survey.findByPk(id);
      if (!data) {
        return res.status(404).json({
          message: "failed",
          error: "Survey not found!",
        });
      }
      await data.destroy();
      return res.status(200).json({
        message: "Survey successfully deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new SurveyController();
