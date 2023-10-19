module.exports = async function (page) {
    // await page.waitForSelector('#scope-options');
    // await page.click("#scope-options")
    // await page.keyboard.press('ArrowDown');
    // await page.keyboard.press('Enter');

    // await new Promise(r => setTimeout(r, 3000))
    await page.goto('https://pemilu2019.kpu.go.id/#/dprri/hitung-suara/');
    await new Promise(r => setTimeout(r, 3000))
    await page.waitForSelector('#scope-options');
    await page.click("#scope-options")
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000))
}