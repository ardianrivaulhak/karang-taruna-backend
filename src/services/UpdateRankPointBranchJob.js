import moment from "moment";
import { Branch } from "../models";
import sequelize from "../models/sequelize";

class UpdateRankPointBranch {
  async start() {
    const t = await sequelize.transaction();
    try {
      const branches = await Branch.findAll({
        order: [
          ["current_point", "desc"],
          ["name", "asc"],
        ],
      });
      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        await branch.update(
          {
            last_updated_rank: i + 1,
            last_updated_date: moment().toDate(),
          },
          { transaction: t }
        );
      }
      await t.commit();
      console.log("Branch rank successfully updated");
    } catch (error) {
      console.log("Branch rank update failed");
      await t.rollback();
      console.log(error);
    }
  }
}

export default new UpdateRankPointBranch();
