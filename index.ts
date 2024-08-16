import { Parser } from "./src/Parser";
import { getTodayDate } from "./utils/date";

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
  const parser = new Parser();
  const products = await parser.getProducts(category);
  if (products.length === 0) {
    console.log(`No products found for category: ${category}`);
    continue;
  }
  const today = getTodayDate();
  const fileName = category === "top-picks" ? "" : `-${category}`;
  await Bun.write(
    `./output/${today}${fileName}.json`,
    JSON.stringify(products, null, 2)
  );
}
