import dotenv from "dotenv";
import FirecrawlApp from "firecrawl";

dotenv.config();

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

async function testCrawl() {
  try {
    const response = await app.scrape("https://example.com", {
      formats: ["markdown"],
    });

    console.log("Crawl Success:");
    console.log(response);
  } catch (error) {
    console.error("Crawl Failed:");
    console.error(error);
  }
}

testCrawl();