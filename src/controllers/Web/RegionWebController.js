import { Op } from "sequelize";
import {
  Branch,
  City,
  District,
  Member,
  Province,
  Village,
} from "../../models";
import sequelize from "../../models/sequelize";

class RegionWebController {
  async getRegion(req, res) {
    try {
      const { province_id } = req.params;
      const region = await Province.findByPk(province_id, {
        attributes: ["id", "name"],
        include: {
          separate: true,
          model: City,
          attributes: ["id", "name"],
          include: {
            separate: true,
            model: District,
            attributes: ["id", "name"],
            include: {
              separate: true,
              model: Village,
              attributes: ["id", "name"],
            },
          },
        },
      });
      if (!region) {
        return res.status(404).json({
          message: "Province not found!",
        });
      }
      return res.status(200).json({
        message: "success",
        data: region,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async removeProvince(req, res) {
    const t = await sequelize.transaction();
    try {
      const { province_id } = req.params;
      const province = await Province.findByPk(province_id, {
        include: {
          separate: true,
          model: City,
          attributes: ["id", "name"],
          include: {
            separate: true,
            model: District,
            attributes: ["id", "name"],
            include: {
              separate: true,
              model: Village,
              attributes: ["id", "name"],
            },
          },
        },
        transaction: t,
      });
      if (!province) {
        await t.rollback();
        return res.status(404).json({
          message: "Province not found!",
        });
      }
      const _province = province.toJSON();
      const cities = _province.Cities;
      for (let i = 0; i < cities.length; i++) {
        const districts = cities[i].Districts;
        for (let j = 0; j < districts.length; j++) {
          const villages = districts[j].Villages;
          for (let k = 0; k < villages.length; k++) {
            const member = await Member.findOne({
              where: { village_id: villages[k].id },
              transaction: t,
            });
            if (member) {
              await t.rollback();
              return res.status(422).json({
                message: "Member has already registered at this village!",
              });
            }
            const branch = await Branch.findOne({
              where: { village_id: villages[k].id },
              transaction: t,
            });
            if (branch) {
              await t.rollback();
              return res.status(422).json({
                message: "Branch has already registered at this village!",
              });
            }
            await Village.destroy({
              where: { id: villages[k].id },
              transaction: t,
            });
          }
          await District.destroy({
            where: { id: districts[j].id },
            transaction: t,
          });
        }
        await City.destroy({ where: { id: cities[i].id }, transaction: t });
      }
      await province.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({
        message: "Successfully delete Province data",
      });
    } catch (error) {
      console.log("Failed when deleting Province Data ==========> ", error);
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async removeCity(req, res) {
    const t = await sequelize.transaction();
    try {
      const { city_id } = req.params;
      const city = await City.findByPk(city_id, {
        include: {
          separate: true,
          model: District,
          attributes: ["id", "name"],
          include: {
            separate: true,
            model: Village,
            attributes: ["id", "name"],
          },
        },
        transaction: t,
      });
      if (!city) {
        await t.rollback();
        return res.status(404).json({
          message: "City not found!",
        });
      }
      const _city = city.toJSON();
      const districts = _city.Districts;
      for (let i = 0; i < districts.length; i++) {
        const villages = districts[i].Villages;
        for (let j = 0; j < villages.length; j++) {
          const member = await Member.findOne({
            where: { village_id: villages[j].id },
            transaction: t,
          });
          if (member) {
            await t.rollback();
            return res.status(422).json({
              message: "Member has already registered at this village!",
            });
          }
          const branch = await Branch.findOne({
            where: { village_id: villages[j].id },
            transaction: t,
          });
          if (branch) {
            await t.rollback();
            return res.status(422).json({
              message: "Branch has already registered at this village!",
            });
          }
          await Village.destroy({
            where: { id: villages[j].id },
            transaction: t,
          });
        }
        await District.destroy({
          where: { id: districts[i].id },
          transaction: t,
        });
      }
      await city.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({
        message: "Successfully delete City data",
      });
    } catch (error) {
      console.log("Failed when deleting City Data ==========> ", error);
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async removeDistrict(req, res) {
    const t = await sequelize.transaction();
    try {
      const { district_id } = req.params;
      const district = await District.findByPk(district_id, {
        include: {
          separate: true,
          model: Village,
          attributes: ["id", "name"],
        },
        transaction: t,
      });
      if (!district) {
        await t.rollback();
        return res.status(404).json({
          message: "District not found!",
        });
      }
      const _district = district.toJSON();
      const villages = _district.Villages;
      for (let i = 0; i < villages.length; i++) {
        const member = await Member.findOne({
          where: { village_id: villages[i].id },
          transaction: t,
        });
        if (member) {
          await t.rollback();
          return res.status(422).json({
            message: "Member has already registered at this village!",
          });
        }
        const branch = await Branch.findOne({
          where: { village_id: villages[i].id },
          transaction: t,
        });
        if (branch) {
          await t.rollback();
          return res.status(422).json({
            message: "Branch has already registered at this village!",
          });
        }
        await Village.destroy({
          where: { id: villages[i].id },
          transaction: t,
        });
      }
      await district.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({
        message: "Successfully delete District data",
      });
    } catch (error) {
      console.log("Failed when deleting District Data ==========> ", error);
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async removeVillage(req, res) {
    const t = await sequelize.transaction();
    try {
      const { village_id } = req.params;
      const village = await Village.findByPk(village_id, { transaction: t });
      if (!village) {
        await t.rollback();
        return res.status(404).json({
          message: "Village not found!",
        });
      }
      const member = await Member.findOne({
        where: { village_id },
        transaction: t,
      });
      if (member) {
        await t.rollback();
        return res.status(422).json({
          message: "Member has already registered at this village!",
        });
      }
      const branch = await Branch.findOne({
        where: { village_id },
        transaction: t,
      });
      if (branch) {
        await t.rollback();
        return res.status(422).json({
          message: "Branch has already registered at this village!",
        });
      }
      await village.destroy({ transaction: t });
      await t.commit();
      return res.status(200).json({
        message: "Successfully delete Village data",
      });
    } catch (error) {
      console.log("Failed when deleting City Data ==========> ", error);
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async updateRegion(req, res) {
    const t = await sequelize.transaction();
    try {
      const region_data = req.body;
      for (let i = 0; i < region_data.length; i++) {
        let region;
        let parentRegionType;
        let model;
        const el = region_data[i];
        switch (el.type) {
          case "province":
            region = el.is_new
              ? null
              : await Province.findByPk(el.id, { transaction: t });
            model = Province;
            break;
          case "city":
            region = el.is_new
              ? null
              : await City.findByPk(el.id, { transaction: t });
            parentRegionType = "province_id";
            model = City;
            break;
          case "district":
            region = el.is_new
              ? null
              : await District.findByPk(el.id, { transaction: t });
            parentRegionType = "city_id";
            model = District;
            break;
          case "village":
            region = el.is_new
              ? null
              : await Village.findByPk(el.id, { transaction: t });
            parentRegionType = "district_id";
            model = Village;
            break;
          default:
            await t.rollback();
            return res.status(422).json({
              message: "type not exist",
            });
        }
        if (el.is_new) {
          let regionPayload = { name: el.name };
          if (el.type !== "province") {
            regionPayload[parentRegionType] = el.parent_id;
          }
          await model.create(regionPayload, { transaction: t });
        } else {
          if (!region) {
            await t.rollback();
            return res.status(404).json({
              message: el.id + " this " + el.type + "doesn't exist",
            });
          }
          await region.update(
            {
              name: el.name,
            },
            { transaction: t }
          );
        }
      }
      await t.commit();
      return res.status(200).json({
        message: "Region data successfully saved",
      });
    } catch (error) {
      console.log("Failed when updating Region Data ==========> ", error);
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }
}

export default new RegionWebController();
