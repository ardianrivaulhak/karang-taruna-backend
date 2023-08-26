import { City, District, Member, Province, Village } from "../models";

class RatingController {
  async getAllRatingByMember(req, res) {
    try {
      const { city_id, district_id } = req.query;

      const data = await Member.findAll({
        attributes: ["id", "user_id", "name", "rating"],
        include: [
          {
            model: Village,
            include: {
              model: District,
              where: {
                ...(district_id && { id: district_id }),
              },
              include: {
                model: City,
                where: {
                  ...(city_id && { id: city_id }),
                },
                include: {
                  model: Province,
                },
              },
            },
          },
        ],
      });

      const _data = data.map((el) => {
        const _el = el.toJSON();
        return {
          id: _el.id,
          user_id: _el.user_id,
          name: _el.name,
          rating: _el.rating,
          village_id: _el.Village.id,
          name_village: _el.Village.name,
          district_id: _el.Village.District.id,
          district_name: _el.Village.District.name,
          city_id: _el.Village.District.City.id,
          city_name: _el.Village.District.City.name,
          province_id: _el.Village.District.City.Province.id,
          province_name: _el.Village.District.City.Province.name,
        };
      });

      res.status(200).json({
        message: "Success Read Data",
        _data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default new RatingController();
