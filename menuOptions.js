module.exports = {
    initialMenuOptions: {
      reply_markup: {
        keyboard: [["Enter Password"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
    mainMenuOptions: {
      reply_markup: {
        keyboard: [["LinkedIn"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
    linkedInMenuOptions: {
      reply_markup: {
        keyboard: [
          ["Finance and Related Services", "Human Resources and Education"],
          ["Health and Related Services", "Engineering and Construction"],
          ["Information Technologies and Related Services", "Media Arts and Entertainment"],
          ["Marketing and Advertising", "Manufacturing and Industrial Products"],
          ["Service Sector and Logistics", "Government and Public Services"],
          ["Custom"],
          ["Back"]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
    jobCountOptions: {
      reply_markup: {
        keyboard: [["1", "6", "8"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
    monitoringDurationOptions: {
      reply_markup: {
        keyboard: [["20 min", "30 min", "1 Hour"], ["Cancel"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  };
  