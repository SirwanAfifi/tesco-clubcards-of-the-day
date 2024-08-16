import { readdir, unlink } from "fs/promises";
import { join } from "path";

const getDate7DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return new Intl.DateTimeFormat("en-GB").format(date).replace(/\//g, "-");
};

const deleteOldFiles = async () => {
  const outputDir = "./output";
  const date7DaysAgo = getDate7DaysAgo();

  try {
    const files = await readdir(outputDir);

    for (const file of files) {
      const filePath = join(outputDir, file);
      const fileDate = file.match(/\d{2}-\d{2}-\d{4}/)?.[0];

      if (fileDate && fileDate < date7DaysAgo) {
        try {
          await unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (err) {
          console.error(`Error deleting file ${filePath}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory: ${err.message}`);
  }
};

deleteOldFiles();
