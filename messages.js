module.exports = {
    WELCOME_MESSAGE: "Welcome! Please enter the password to access the menu:",
    PASSWORD_PROMPT: "Please enter the password:",
    PASSWORD_CORRECT: "Password correct! Choose your working model:",
    CHOOSE_CATEGORY: "Choose a job category:",
    RETURNING_TO_MAIN_MENU: "Returning to main menu:",
    ENTER_JOB_TITLE: "Please enter the job title you want to search for:",
    ENTER_JOB_COUNT: "How many jobs do you want to fetch?",
    ENTER_MONITOR_DURATION: "How long do you want to monitor for new jobs?",
    MONITORING_CANCELLED: "Monitoring cancelled. Please enter the password to access the menu again:",
    MONITORING_STARTED: "Monitoring has started. You can cancel anytime by selecting 'Cancel'.",
    MONITORING_PERIOD_ENDED: (duration) => `Monitoring period ended. No new job postings for ${duration}.`,
    NO_NEW_JOBS: "I'm sorry, I couldn't find a new job, I'm looking for it again.",
    INCORRECT_PASSWORD: "Incorrect password or unrecognized command. Please try again or click 'Enter Password' to retry.",
    JOB_DETAILS: (job) => `*Job Title:* ${job.jobTitle}\n*📅 Posting Time:* ${job.postingTime}\n*🏢 Company Name:* ${job.companyName}\n*👥 Applicant Count:* ${job.applyCount}`,
    NEW_JOB_DETAILS: (job) => `*New Job Title:* ${job.jobTitle}\n*📅 Posting Time:* ${job.postingTime}\n*🏢 Company Name:* ${job.companyName}\n*👥 Applicant Count:* ${job.applyCount}`,
    MONITORING_CHOICE: (jobTitle, jobCount, duration) => `You chose to search for ${jobTitle} and fetch ${jobCount} jobs. Monitoring for ${duration}...`
  };
  