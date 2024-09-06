import * as cheerio from "cheerio";
import { Product } from "./Product";
import puppeteer from "puppeteer";

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
    const url = `${URL}/${category}?page=${pageNumber}&all?viewAll=promotion&promotion=offers`;
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
          image:
            $(item)
              .siblings()
              .find("picture img")
              .attr("srcset")
              ?.split(" ")[0] || "",
        };
      });
    return products.get();
  }

  private async loadContent(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-sandbox",
        "--no-zygote",
        "--deterministic-fetch",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--disable-http2", // Disable HTTP/2
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    try {
      await page.goto(url, {
        waitUntil: "networkidle0",
      });
      const html = await page.content();
      return cheerio.load(html);
    } catch (error) {
      console.error("Error loading page:", error);
      throw error;
    } finally {
      await browser.close();
    }
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
