require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const fetchJobDetails = require("./linkedin");
const { categories, monitoringDurations } = require("./config");
const {
  initialMenuOptions,
  mainMenuOptions,
  linkedInMenuOptions,
  jobCountOptions,
  monitoringDurationOptions
} = require("./menuOptions");
const messages = require("./messages");

const token = process.env.TELEGRAM_BOT_TOKEN;
const correctPassword = process.env.BOT_PASSWORD;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, messages.WELCOME_MESSAGE, initialMenuOptions);
});

bot.onText(/Enter Password/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, messages.PASSWORD_PROMPT);
});

let awaitingCustomJobTitle = false;
let awaitingJobCount = false;
let awaitingDuration = false;
let customJobTitle = "";
let jobCount = 0;
let monitoringDuration = 0;
let monitoringCancelled = false;

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start" || text === "Enter Password") {
    return;
  }

  if (text === correctPassword) {
    bot.sendMessage(chatId, messages.PASSWORD_CORRECT, mainMenuOptions);
  } else if (text === "LinkedIn") {
    bot.sendMessage(chatId, messages.CHOOSE_CATEGORY, linkedInMenuOptions);
  } else if (text === "Back") {
    bot.sendMessage(chatId, messages.RETURNING_TO_MAIN_MENU, mainMenuOptions);
  } else if (text === "Custom") {
    awaitingCustomJobTitle = true;
    bot.sendMessage(chatId, messages.ENTER_JOB_TITLE);
  } else if (awaitingCustomJobTitle) {
    awaitingCustomJobTitle = false;
    customJobTitle = text;
    awaitingJobCount = true;
    bot.sendMessage(chatId, messages.ENTER_JOB_COUNT, jobCountOptions);
  } else if (awaitingJobCount) {
    awaitingJobCount = false;
    jobCount = parseInt(text, 10);
    awaitingDuration = true;
    bot.sendMessage(chatId, messages.ENTER_MONITOR_DURATION, monitoringDurationOptions);
  } else if (awaitingDuration) {
    awaitingDuration = false;
    monitoringCancelled = false;
    if (text === "Cancel") {
      bot.sendMessage(
        chatId,
        messages.MONITORING_CANCELLED,
        initialMenuOptions
      );
      return;
    }
    monitoringDuration = monitoringDurations[text];

    const categoryCode = categories[customJobTitle] || "";
    const url = `https://www.linkedin.com/jobs/search/?f_I=${categoryCode}&f_TPR=r86400&geoId=105072130&sortBy=DD`;

    bot.sendMessage(
      chatId,
      messages.MONITORING_CHOICE(customJobTitle, jobCount, text)
    );

    const cancelButtonOptions = {
      reply_markup: {
        keyboard: [["Cancel"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    bot.sendMessage(
      chatId,
      messages.MONITORING_STARTED,
      cancelButtonOptions
    );

    const getNewJobs = async () => {
      const newJobs = await fetchJobDetails(url, jobCount);
      return newJobs.filter(job => {
        const postingTimeMatch = job.postingTime.match(/(\d+) min ago/);
        return postingTimeMatch && parseInt(postingTimeMatch[1], 10) <= 1;
      });
    };

    const endTime = Date.now() + monitoringDuration;
    const interval = 1 * 60 * 1000; // 1 minute

    const monitorJobs = async () => {
      if (monitoringCancelled || Date.now() >= endTime) {
        if (monitoringCancelled) {
          bot.sendMessage(
            chatId,
            messages.MONITORING_CANCELLED,
            initialMenuOptions
          );
        } else {
          bot.sendMessage(chatId, messages.MONITORING_PERIOD_ENDED(text));
        }
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));

      const newJobs = await getNewJobs();
      if (newJobs.length === 0) {
        bot.sendMessage(
          chatId,
          messages.NO_NEW_JOBS
        );
      } else {
        newJobs.forEach((job) => {
          const jobMessage = messages.NEW_JOB_DETAILS(job);
          const applyButton = {
            reply_markup: {
              inline_keyboard: [[{ text: "Apply", url: job.applicationUrl }]],
            },
            parse_mode: 'Markdown'
          };
          bot.sendMessage(chatId, jobMessage, applyButton);
        });
      }

      monitorJobs();
    };

    (async () => {
      const initialJobs = await fetchJobDetails(url, jobCount);
      initialJobs.forEach((job) => {
        const jobMessage = messages.JOB_DETAILS(job);
        const applyButton = {
          reply_markup: {
            inline_keyboard: [[{ text: "Apply", url: job.applicationUrl }]],
          },
          parse_mode: 'Markdown'
        };
        bot.sendMessage(chatId, jobMessage, applyButton);
      });

      monitorJobs();
    })();
  } else if (Object.keys(categories).includes(text)) {
    customJobTitle = text;
    awaitingJobCount = true;
    bot.sendMessage(chatId, messages.ENTER_JOB_COUNT, jobCountOptions);
  } else if (awaitingJobCount) {
    awaitingJobCount = false;
    jobCount = parseInt(text, 10);
    awaitingDuration = true;
    bot.sendMessage(chatId, messages.ENTER_MONITOR_DURATION, monitoringDurationOptions);
  } else if (text === "Cancel") {
    monitoringCancelled = true;
  } else {
    bot.sendMessage(
      chatId,
      messages.INCORRECT_PASSWORD,
      initialMenuOptions
    );
  }
});

module.exports = bot;
