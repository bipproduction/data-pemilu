const puppeteer = require('puppeteer')

/**
 * 
 * @returns {Promise<puppeteer.Page>}
 */
module.exports = async function () {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 500, height: 1280, isMobile: true },
        args: [`--window-size=500,1280`],
    });
    const [page] = await browser.pages();
    return page
}