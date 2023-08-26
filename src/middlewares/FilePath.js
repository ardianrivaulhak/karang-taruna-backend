import moment from "moment";
import multer from "multer";
import fs from "fs";
import { randNumber } from "../helpers";

const createFolder = (folderType) => {
  const folderName = moment().format("DD-MM-YY");
  let folderPath = `storage/${folderName}/${folderType}`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
};

const storage = (folderType) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, createFolder(folderType));
    },
    filename: function (req, file, cb) {
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${moment().unix()}-${randNumber(
        5
      )}-${folderType}.${fileExtension}`;

      cb(null, fileName);
    },
  });

const uploadNews = multer({ storage: storage("news") });
const uploadEvent = multer({ storage: storage("event") });
const uploadPhotoProfile = multer({ storage: storage("photo-profile") });

export { uploadEvent, uploadNews, uploadPhotoProfile };
