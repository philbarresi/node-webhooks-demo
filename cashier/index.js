// For demonstration purposes, we will only focus on the part of Cashier that
// fakes a payment request after 5 seconds to some hardcoded data
const Axios = require("axios");

const timeBetweenCharges = 5 * 1000; // 5 seconds
const chargeAccounts = [
  {
    application: "jukebox",
    token: "0118-999-881"
  },
  {
    application: "jukebox",
    token: "999-119-7253"
  }
];

const applications = {
  jukebox: {
    name: "Jukebox",
    webhookUrl: "http://localhost:3000/charges"
  }
};

// Fake whether or not a charge worked
const emulatePayment = () => Math.random() < 0.5;

setInterval(() => {
  chargeAccounts.forEach(async account => {
    // for each charge account, fake a charge and then inform the app that the charge worked or not
    const app = applications[account.application];

    const chargeSucceeded = emulatePayment();
    const status = chargeSucceeded ? "charged" : "failed";
    const token = account.token;

    const requestBody = {
      token,
      status
    };

    const result = await Axios.post(app.webhookUrl, requestBody);
    console.log(`Informed ${app.name} of ${status} to token ${token}`);
  });
}, timeBetweenCharges);
