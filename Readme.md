# Clock In/Out Automation Script
⚠️ Code is a mess not optimized and not refactored, this was just done to save time so don't take the code quality too serious 🐈‍⬛ ⚠️
⚠️ Also there can be bugs as this was quickly implemented without a QA phase 😕 ⚠️

This script automates the process of clocking in and out using Playwright. It was created to simplify the tedious manual process of time tracking.

## 🚀 How It Works

The script:

- Opens the time tracking website.
- Logs in using Google authentication.
- Waits for manual completion of the Google 2-Step Verification (if enabled).
- Iterates through each weekday of the current month and fills in clock-in and clock-out times.
- Saves each entry automatically.

## ⚙️ Customization

To use this script for your own needs, modify the following constants in the code:

- `USER_EMAIL` – Replace with your own email.
- `USER_PASSWORD` – Replace with your password (not recommended for security reasons, consider using environment variables instead).
- **Clock In/Out Times** – Adjust the predefined clock-in and clock-out hours to fit your schedule.

### Example:

```js
const USER_EMAIL = "your.email@example.com";
const USER_PASSWORD = "yourpasswordhere";

const clockInTime1 = date.set({ hour: 8, minute: 30, second: 0 });
const clockOutTime1 = date.set({ hour: 13, minute: 0, second: 0 });

const clockInTime2 = date.set({ hour: 13, minute: 20, second: 0 });
const clockOutTime2 = date.set({ hour: 16, minute: 50, second: 0 });
```
Modify the clock-in and clock-out times in the function that fills the form

## 🔐 Google 2-Step Verification Issue
Currently, this script does not bypass Google’s 2-Step Verification. Since Playwright opens a fresh browser instance, each execution requires manual completion of the 2FA process. If you find a way to automate this step securely, contributions are welcome!

## 🛠️ Improvements & Contributions
This script was quickly written with minimal optimization. If you have ideas for improvements, feel free to:

Optimize the Playwright selectors.

Enhance error handling.

Find a secure way to handle authentication.

Pull requests and suggestions are always welcome! 🚀

## 📝 How to Run It
Follow these steps to run the script:

1. Clone the repository:

```
git clone https://github.com/SergiAuletMur/ClockInAutomated.git
cd ClockInAutomated
```

2. Install the dependencies:
Make sure you have Node.js installed, then run:

```
npm install
```

3. Modify the script:

Open the index.js file and adjust the USER_EMAIL, USER_PASSWORD, and clock-in/clock-out times as needed.

Run the script:
````
node script.js
````

The script will open a browser window, log in using your credentials, and automatically fill in the clock-in and clock-out times for each weekday of the current month. Manual completion of the Google 2FA step is required.

For any questions, feel free to open an issue or pull request! ✨
