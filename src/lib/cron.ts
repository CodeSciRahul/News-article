import cron from "node-cron";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article/hourly-fetch`;

cron.schedule("* * * * *", async () => { // Runs every hour at 0 minutes
  try {
    const response = await fetch(API_URL, {method: 'GET'});
    const data = await response.json();
  } catch (error) {
    console.error("Error triggering cron job:", error);
  }
});