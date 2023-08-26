import geografis from "geografis";
import { Province, City, District, Village } from "../models/index.js";

async function seedData() {
  try {
    const dump = geografis.dump();
    for (const item of dump) {
      const provinceName = item.province;
      const cityName = item.city;
      const districtName = item.district;
      const villageName = item.village;

      const [province] = await Province.findOrCreate({
        where: { name: provinceName },
      });

      const [city] = await City.findOrCreate({
        where: { province_id: province.id, name: cityName },
      });

      const [district] = await District.findOrCreate({
        where: { city_id: city.id, name: districtName },
      });

      await Village.findOrCreate({
        where: { district_id: district.id, name: villageName },
      });
    }

    console.log("Seeder berhasil dijalankan.");
  } catch (error) {
    console.error("Terjadi kesalahan saat menjalankan seeder:", error);
  } finally {
    await Promise.all([
      Province.sequelize.close(),
      City.sequelize.close(),
      District.sequelize.close(),
      Village.sequelize.close(),
    ]);
  }
}

seedData()
  .then(() => {
    console.log("Seed Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// export default seedData;
