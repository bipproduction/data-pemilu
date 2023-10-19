module.exports = async function (page, name) {
    console.log(`temukan tombol ${name}`)
    await new Promise(r => setTimeout(r, 2000))
    const button = await page.$x(`//button[contains(., "${name.replace('+', '')}")]`);
    console.log(`Banyaknya Tombol: ${button.length}`.yellow)
    if (button[0]) {
        console.log(`click ${name}`.yellow)
        await new Promise(r => setTimeout(r, 1000))
        await button[0].click();
    }
}