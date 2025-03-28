const { chromium } = require('playwright');
const { DateTime } = require('luxon');

const USER_EMAIL = "sergi.aulet@launchmetrics.com";
const USER_PASSWORD = "yourpasswordhere";

const nextButtonLabels = ["Next", "Siguiente", "Següent"];

async function fillClockInOut(page, date, clockInTime, clockOutTime) {
    // Format the clock-in and clock-out times
    const clockInValue = clockInTime.toFormat("yyyy-MM-dd'T'HH:mm");
    const clockOutValue = clockOutTime.toFormat("yyyy-MM-dd'T'HH:mm");
    let noErrors = true;

    // Select the Clock In input field and set the value
    await page.fill('input[type="datetime-local"]', clockInValue);

    // Focus the input and click outside to trigger validation
    await page.click('span.FieldName:has-text("Clock In")'); // Click on the "Clock In" label to blur the input

    await page.waitForTimeout(1000);

    // Select the Clock Out input field and set the value
    const clockOutInput = await page.waitForSelector('input[aria-label="Clock Out"]');
    await clockOutInput.fill(clockOutValue); // Fill the value for Clock Out

    // Focus the input and click outside to trigger validation
    await page.click('span.FieldName:has-text("Clock In")'); // Click on the "Clock In" label to blur the input

    await page.waitForTimeout(1000);


    // Check if any error message appears
    const errorMessagesAfterClockOut = await page.locator('div[data-testid="error-message-text"]').all();
    for (const errorMessage of errorMessagesAfterClockOut) {
        const text = await errorMessage.textContent();
        if(text.includes("Clock Out cannot be earlier than Clock In. Please adjust the time")) {
            noErrors = true;
        } else {
            console.log(`Skipping ${date.toISODate()} due to an error: ${text}`);
            noErrors = false;
        }
    }

    return noErrors; // Successfully filled Clock In and Clock Out
}

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    const url = "https://www.appsheet.com/start/c1141281-d882-4fef-80fc-d82f5fd8094a?newUser=true&onboarding=true&platform=desktop#vss=H4sIAAAAAAAAA6WOMQ_CIBSE_8vNLCa6sKqDMTqocREHKK8JsZamUGtD-O-C1Tg3ju_efXcX8DDUH70sbuCX8Lu2NIAjCJyGhgS4wNLWvrWVABPYy_sorshLk7SIeGVf2pMDD1Ng_k8zg9FUe1MaanNS5lLCh0rvzCRhJBAZ7p2XqqL31EwcbD-2ztVCqULNEGOylbboHOlzWjZ5kdvU62cja72zOnWUsnIUXytheituAQAA&row=4b5bbcb1&view=Detail&appName=LM_TimeTracking_Spain-429896822";

    await page.goto(url, { waitUntil: 'load' });
    console.log("Page loaded");

    // Click on the Google button
    const googleButton = await page.waitForSelector('button#Google');
    await googleButton.click();
    console.log("Clicked Google login button");

    // Wait for the email input field and type the email
    const emailInput = await page.waitForSelector('input#identifierId');
    await emailInput.fill(USER_EMAIL);
    console.log("Entered email");

    let nextButton;
    for (const label of nextButtonLabels) {
        nextButton = await page.locator(`button:has-text("${label}")`).first();
        if (await nextButton.isVisible()) {
          break;
        }
    }

    if (nextButton) {
        await nextButton.click();
        console.log("Clicked Next button");
    } else {
        throw("Next button not found, please try commenting the google login part and try again doing it manually");
    }

    // Wait for the password input field and type the password
    const passwordInput = await page.waitForSelector('input[name="Passwd"]');
    await passwordInput.fill(USER_PASSWORD);
    console.log("Entered password");

    let passwordNextButton;
    for (const label of nextButtonLabels) {
        passwordNextButton = await page.locator(`button:has-text("${label}")`).first();
        if (await nextButton.isVisible()) {
          break;
        }
    }

    // Click the Next button after entering password
    if (passwordNextButton) {
        await passwordNextButton.click();
        console.log("Clicked password Next button");
      } else {
        throw("Password Next button not found, please try commenting the google login part and try again doing it manually");
      }

    // Wait for manual step and redirection
    console.log("Waiting for manual step and redirection...");
    await page.waitForNavigation({ waitUntil: 'load' });
    console.log("Page loaded after manual step");

    const now = DateTime.local(); // Get current date/time
    const startOfMonth = now.startOf('month'); // First day of the current month
    const endOfMonth = now.endOf('month'); // Last day of the current month

    // Click the Add button
    const addButton = await page.waitForSelector('button:has-text("Add")');
    await addButton.click();
    console.log("Clicked Add button");
    // Loop through each day of the month
    for (let date = startOfMonth; date <= endOfMonth; date = date.plus({ days: 1 })) {
        await page.waitForTimeout(1000);

        const dateString = date.toISODate(); // Get date in YYYY-MM-DD format
        console.log(`Adding entry for ${dateString}`);

        if (date.weekday === 6 || date.weekday === 7) {  // 6 = Saturday, 7 = Sunday
            console.log(`Skipping ${dateString} as it's a weekend.`);
            continue; // Skip this iteration if it's a weekend
        }

        // First time with the original clock-in and clock-out values
        const clockInTime1 = date.set({ hour: 8, minute: 30, second: 0 });
        const clockOutTime1 = date.set({ hour: 13, minute: 0, second: 0 });

        const success1 = await fillClockInOut(page, date, clockInTime1, clockOutTime1);

        if (success1) {
            // Click on the "Workday" button after filling in the clock-in and clock-out inputs
            const workdayButton1 = page.locator('span[data-testid="button-select-button"]:has-text("Workday")');
            await workdayButton1.click();
            console.log(`Clicked Workday button for ${dateString}`);

            // Click on the "Save" button after clicking Workday
            const saveButton1 = await page.waitForSelector('button:has(span:has-text("Save"))');
            await saveButton1.click();
            console.log("Clicked Save button");
            await page.waitForTimeout(2000);
            console.log("Waiting 2 seconds to entry be saved");
            const addButton1 = await page.waitForSelector('button:has-text("Add")');
            await addButton1.click();
            console.log("Clicked Add button");
        }

        // Second time with different clock-in and clock-out values
        const clockInTime2 = date.set({ hour: 13, minute: 20, second: 0 });
        const clockOutTime2 = date.set({ hour: 16, minute: 50, second: 0 });

        const success2 = await fillClockInOut(page, date, clockInTime2, clockOutTime2);
        if (!success2) continue; // Skip if there was an error

        // Click on the "Workday" button after filling in the clock-in and clock-out inputs
        const workdayButton = page.locator('span[data-testid="button-select-button"]:has-text("Workday")');
        await workdayButton.click();
        console.log(`Clicked Workday button for ${dateString}`);

        // Click on the "Save" button after clicking Workday
        const saveButton = await page.waitForSelector('button:has(span:has-text("Save"))');
        await saveButton.click();
        console.log("Clicked Save button");

        await page.waitForTimeout(2000);
        console.log("Waiting 2 seconds to entry be saved");
        const addButton = await page.waitForSelector('button:has-text("Add")');
        await addButton.click();
        console.log("Clicked Add button");
    }

    await browser.close();
})();
