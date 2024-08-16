import * as cheerio from "cheerio";
import { Product } from "./Product";

const URL = "https://www.tesco.com/groceries/en-GB/buylists/clubcard-prices";

export class Parser {
  private products: Product[] = [];

  public async getProducts(category: string): Promise<Product[]> {
    const lastPageNumber = await this.getLastPageNumber(category);
    for (let pageNumber = 1; pageNumber <= lastPageNumber; pageNumber++) {
      const pageProducts = await this.getProductsFromPage(category, pageNumber);
      console.log(pageProducts);
      this.products.push(...pageProducts);
    }
    return this.products;
  }

  private async getProductsFromPage(
    category: string,
    pageNumber: number
  ): Promise<Product[]> {
    const url = `${URL}/${category}?page=${pageNumber}`;
    console.log(`Loading ${url}`);
    const $ = await this.loadContent(url);

    const items = $(".product-list--list-item");
    const products = items
      .find(".product-details--wrapper")
      .filter((index, item) => {
        return (
          $(item).find(
            "div[class^='styles__StyledPromotionsWithClubcardPriceContainer-']"
          ).length > 0
        );
      })
      .map((index, item) => {
        const clubCardPrice = $(item)
          .find("div[class^='styled__ClubcardPriceLogo-sc-']")
          .siblings()
          .eq(0)
          .find("p:nth-child(1)")
          .text()
          .split(" Clubcard Price")[0];

        return {
          id: $(item).find("a").attr("href")?.split("/").pop() || "",
          title: $(item).find("h3").text(),
          price: $(item)
            .siblings()
            .find(".buybox-container p:nth-child(1)")
            .text(),
          clubCardPrice,
          image: $(item).siblings().find("picture img").attr("src") || "",
        };
      });
    return products.get();
  }

  private async loadContent(url: string) {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
  }

  private async getLastPageNumber(category: string): Promise<number> {
    const $ = await this.loadContent(`${URL}/${category}`);
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
