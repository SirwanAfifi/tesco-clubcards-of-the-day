import { Parser } from "./src/Parser";

const parser = new Parser();

const products = await parser.getProducts();

const date = new Intl.DateTimeFormat("en-GB").format(new Date());
const fileName = date.replace(/\//g, "-");

await Bun.write(
  `./output/${fileName}-data.json`,
  JSON.stringify(products, null, 2)
);
