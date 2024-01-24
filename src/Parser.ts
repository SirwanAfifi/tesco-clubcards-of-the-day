import * as cheerio from "cheerio";
import { Product } from "./Product";

const URL =
  "https://www.tesco.com/groceries/en-GB/buylists/clubcard-prices/top-picks";

export class Parser {
  private products: Product[] = [];

  public async getProducts(): Promise<Product[]> {
    const lastPageNumber = await this.getLastPageNumber();
    for (let pageNumber = 1; pageNumber <= lastPageNumber; pageNumber++) {
      const pageProducts = await this.getProductsFromPage(pageNumber);
      this.products.push(...pageProducts);
    }
    return this.products;
  }

  private async getProductsFromPage(pageNumber: number): Promise<Product[]> {
    const url = `${URL}?page=${pageNumber}`;
    const $ = await this.loadContent(url);

    const items = $(".product-list--list-item");
    const products = items
      .find(".product-details--wrapper:has(.promotions-offer-content)")
      .map((index, item) => ({
        title: $(item).find("h3").text(),
        price: $(item)
          .siblings()
          .find(".buybox-container p:nth-child(1)")
          .text(),
        clubCardPrice: $(item)
          .find(".promotions-offer-content")
          .text()
          .split(" Clubcard Price")[0],
        image: $(item).siblings().find("picture img").attr("src") || "",
      }));
    return products.get();
  }

  private async loadContent(url: string = URL) {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
  }

  private async getLastPageNumber(): Promise<number> {
    const $ = await this.loadContent();
    const pageNumbers: number[] = [];

    $(".pagination-btn-holder a").each(function () {
      const pageText = $(this).text().trim();
      const pageNumber = parseInt(pageText);
      if (!isNaN(pageNumber)) {
        pageNumbers.push(pageNumber);
      }
    });
    const lastPage = Math.max(...pageNumbers);
    return lastPage;
  }
}
