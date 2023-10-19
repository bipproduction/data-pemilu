module.exports = async function (page) {
    console.log("select filter wilayah")
    await page.waitForSelector('#scope-options');
    await page.click("#scope-options")
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000))
}