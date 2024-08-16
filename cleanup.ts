import * as fs from "fs";
import * as path from "path";

const getTodayDate = () => {
  const date = new Intl.DateTimeFormat("en-GB").format(new Date());
  const today = date.replace(/\//g, "-");
  return today;
};

const getDateOneWeekAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const formattedDate = new Intl.DateTimeFormat("en-GB").format(date);
  return formattedDate.replace(/\//g, "-");
};

const deleteOldFiles = () => {
  const outputDir = "./output";
  const oneWeekAgo = getDateOneWeekAgo();

  fs.readdir(outputDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(outputDir, file);
      const fileDate = file.match(/\d{2}-\d{2}-\d{4}/)?.[0];

      if (fileDate && fileDate < oneWeekAgo) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${filePath}: ${err.message}`);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      }
    });
  });
};

deleteOldFiles();
