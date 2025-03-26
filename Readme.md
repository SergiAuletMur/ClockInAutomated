Clock In/Out Automation Script

This script automates the process of clocking in and out using Playwright. It was created to simplify the tedious manual process of time tracking.

🚀 How It Works

The script:

Opens the time tracking website.

Logs in using Google authentication.

Waits for manual completion of the Google 2-Step Verification (if enabled).

Iterates through each weekday of the current month and fills in clock-in and clock-out times.

Saves each entry automatically.

⚙️ Customization

To use this script for your own needs, modify the following constants in the code:

USER_EMAIL – Replace with your own email.

USER_PASSWORD – Replace with your password (not recommended for security reasons, consider using environment variables instead).

Clock In/Out Times – Adjust the predefined clock-in and clock-out hours to fit your schedule.

Example:

const USER_EMAIL = "your.email@example.com";
const USER_PASSWORD = "yourpasswordhere";

Modify the clock-in and clock-out times in the function that fills the form:

const clockInTime1 = date.set({ hour: 8, minute: 30, second: 0 });
const clockOutTime1 = date.set({ hour: 13, minute: 0, second: 0 });

const clockInTime2 = date.set({ hour: 13, minute: 20, second: 0 });
const clockOutTime2 = date.set({ hour: 16, minute: 50, second: 0 });

🔐 Google 2-Step Verification Issue

Currently, this script does not bypass Google’s 2-Step Verification. Since Playwright opens a fresh browser instance, each execution requires manual completion of the 2FA process. If you find a way to automate this step securely, contributions are welcome!

🛠️ Improvements & Contributions

This script was quickly written with minimal optimization. If you have ideas for improvements, feel free to:

Optimize the Playwright selectors.

Enhance error handling.

Find a secure way to handle authentication.

Pull requests and suggestions are always welcome! 🚀
