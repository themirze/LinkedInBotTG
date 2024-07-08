require("dotenv").config();
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const selectors = {};
const selectorEnvPath = path.resolve(__dirname, "selectors.env");
fs.readFileSync(selectorEnvPath, "utf-8")
  .split(/\r?\n/)
  .forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      selectors[key.trim()] = value.trim();
    }
  });

async function fetchJobDetails(url, jobCount) {
  const browser = await chromium.launch({ headless: true }); // Run in headless mode for efficiency
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const linkedinCookieValue = process.env.LINKEDIN_COOKIE;
  if (!linkedinCookieValue) {
    console.error("LinkedIn cookie value is not set in the environment variables");
    process.exit(1);
  }
  await context.addCookies([
    {
      name: "li_at",
      value: linkedinCookieValue,
      domain: ".linkedin.com",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
  ]);

  // Additional headers to mimic a real browser
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
    "accept-encoding": "gzip, deflate, br",
  });
  try {
    await page.goto(url, { waitUntil: "load" });
  } catch (error) {
    console.error("Error during navigation:", error);
    await browser.close();
    throw error;
  }

  // Random delay to mimic human interaction
  await page.waitForTimeout(Math.random() * 3000 + 2000); // Wait between 2-5 seconds

  
  await page.waitForSelector(selectors.JOB_LINK_SELECTOR);

  const jobDetails = [];

  
  async function extractJobDetails() {
    const jobCards = await page.$$(selectors.JOB_LINK_SELECTOR);

    for (let i = 0; i < jobCount && i < jobCards.length; i++) {
      await jobCards[i].click();

      // Random delay to mimic human interaction
      await page.waitForTimeout(Math.random() * 3000 + 2000); // Wait between 2-5 seconds

      
      await page.waitForSelector(selectors.TITLE_SELECTOR, { timeout: 30000 });

      
      const jobTitle = await page.evaluate((selector) => {
        const titleElement = document.querySelector(selector);
        return titleElement ? titleElement.innerText : "No title found";
      }, selectors.TITLE_SELECTOR);

      const postingTime = await page.evaluate((selector) => {
        const timeElement = document.querySelector(selector);
        return timeElement ? timeElement.innerText : "No posting time found";
      }, selectors.POSTING_TIME_SELECTOR);

      const companyName = await page.evaluate((selector) => {
        const companyElement = document.querySelector(selector);
        return companyElement ? companyElement.innerText : "Company name not found";
      }, selectors.COMPANY_NAME_SELECTOR);

      const applyCount = await page.evaluate((selector) => {
        const countElement = document.querySelector(selector);
        return countElement ? countElement.innerText : "Applicant count not found";
      }, selectors.APPLY_COUNT_SELECTOR);

      
      const applicationUrl = await page.evaluate((selector) => {
        const anchorElement = document.querySelector(selector + " a");
        return anchorElement ? `https://www.linkedin.com${anchorElement.getAttribute("href")}` : "";
      }, selectors.TITLE_SELECTOR);

      jobDetails.push({
        jobTitle,
        postingTime,
        companyName,
        applyCount,
        applicationUrl,
      });
    }
  }

  await extractJobDetails();
  await browser.close();

  return jobDetails;
}

module.exports = fetchJobDetails;
