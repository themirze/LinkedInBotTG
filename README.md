# LinkedIn Job Scraper Bot

This repository contains a Telegram bot that scrapes job postings from LinkedIn based on user-defined criteria. The bot can monitor specific job categories, fetch job details, and notify users about new job postings.

## Features

- Password-protected access to the bot.
- Select job categories or custom job titles.
- Set the number of jobs to fetch.
- Monitor for new jobs for a specified duration.
- Notify users about new job postings via Telegram.
- Cancel monitoring at any time.

## Prerequisites

- Node.js installed on your machine.
- A LinkedIn account with a valid session cookie.
- A Telegram bot token.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/themirze/linkedin-job-scraper-bot.git
    cd linkedin-job-scraper-bot
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory of the project and add the following variables:

    ```env
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token
    BOT_PASSWORD=your_password
    LINKEDIN_COOKIE=your_linkedin_cookie
    ```

4. **Create `selectors.env` file:**

    Create a `selectors.env` file in the root directory of the project and add the following content:

    ```env
    TITLE_SELECTOR=.t-24.t-bold.inline
    POSTING_TIME_SELECTOR=.tvm__text.tvm__text--positive span:last-child
    COMPANY_NAME_SELECTOR=.job-details-jobs-unified-top-card__company-name .app-aware-link
    APPLY_COUNT_SELECTOR=.t-black--light.mt2 .tvm__text.tvm__text--low-emphasis:last-child
    JOB_LINK_SELECTOR=.job-card-container__link.job-card-list__title
    ```

## Usage

1. **Start the bot:**

    ```bash
    node bot.js
    ```

2. **Interact with the bot on Telegram:**

    - Send `/start`.
    - Enter the password to access the menu.
    - Choose a job category or enter a custom job title.
    - Specify the number of jobs to fetch.
    - Set the duration for monitoring new jobs.
    - The bot will notify you about new job postings and provide application links.

## Code Overview

### `bot.js`

This file contains the main logic for the Telegram bot. It handles user interactions, fetches job details from LinkedIn, and monitors for new job postings.

### `linkedin.js`

This file contains the logic for scraping LinkedIn job postings using Playwright. It uses selectors defined in `selectors.env` to extract job details.

### `selectors.env`

This file contains CSS selectors used to scrape job details from LinkedIn pages.

## Example Interaction

1. **User sends `/start`**
2. **Bot:** "Welcome! Please enter the password to access the menu:"
3. **User enters the correct password**
4. **Bot:** "Password correct! Choose your working model:" (Displays LinkedIn option)
5. **User selects a job category or chooses Custom to enter a job title**
6. **Bot:** "How many jobs do you want to fetch?" (Displays options 4, 6, 8)
7. **User selects the number of jobs**
8. **Bot:** "How long do you want to monitor for new jobs?" (Displays options 20 min, 30 min, 1 Hour, Cancel)
9. **User selects the duration**
10. **Bot:** "Monitoring has started. You can cancel anytime by selecting 'Cancel'."
11. **Bot notifies the user about new job postings during the monitoring period

## Notes

- Ensure that your LinkedIn session cookie is valid and updated in the `.env` file.
- The bot uses Playwright in headless mode for efficient scraping.
- Random delays are added to mimic human interaction and reduce the risk of LinkedIn detecting bot activity.

## Troubleshooting

- **ERR_TOO_MANY_REDIRECTS**: Ensure your LinkedIn cookie is valid and correctly set in the `.env` file.
- **Cannot fetch job details**: Verify that the selectors in `selectors.env` match the current LinkedIn page structure.

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
