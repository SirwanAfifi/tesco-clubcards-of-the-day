import { readdir, unlink } from "fs/promises";
import { join } from "path";

const getLast7DaysOfMonth = () => {
  const date = new Date();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const firstDayOfLast7Days = new Date(lastDayOfMonth);
  firstDayOfLast7Days.setDate(lastDayOfMonth.getDate() - 6);

  const dates = [];
  for (
    let d = firstDayOfLast7Days;
    d <= lastDayOfMonth;
    d.setDate(d.getDate() + 1)
  ) {
    dates.push(
      new Intl.DateTimeFormat("en-GB").format(new Date(d)).replace(/\//g, "-")
    );
  }
  return dates;
};

const deleteOldFiles = async () => {
  const outputDir = "./output";
  const last7Days = getLast7DaysOfMonth();

  try {
    const files = await readdir(outputDir);

    for (const file of files) {
      const filePath = join(outputDir, file);
      const fileDate = file.match(/\d{2}-\d{2}-\d{4}/)?.[0];

      if (fileDate && !last7Days.includes(fileDate)) {
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
