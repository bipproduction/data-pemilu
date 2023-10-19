const { default: puppeteer } = require("puppeteer");

module.exports = async function (url) {
    const _url = url ?? 'https://pemilu2019.kpu.go.id/#/dprri/hitung-suara/'
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 500, height: 1280, isMobile: true },
        args: [`--window-size=500,1280`],
    });
    const [page] = await browser.pages();

    // Buka halaman web yang ingin Anda scrapping
    await page.goto(url);
    await new Promise(r => setTimeout(r, 3000))
    return page
}