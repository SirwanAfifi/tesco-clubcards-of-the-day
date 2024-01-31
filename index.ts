import { Parser } from "./src/Parser";
import { getTodayDate } from "./utils/date";

const parser = new Parser();

const categories = [
  "top-picks",
  "frozen",
  "fresh",
  "beer-wine-spirits",
  "snacks-and-treats",
  "household",
  "food-cupboard",
  "bakery",
  "health-beauty-and-baby",
  "online-only-offers",
];

for (const category of categories) {
  const products = await parser.getProducts(category);
  const today = getTodayDate();
  const fileName = category === "top-picks" ? "" : category;
  await Bun.write(
    `./output/${today}-${fileName}.json`,
    JSON.stringify(products, null, 2)
  );
}
