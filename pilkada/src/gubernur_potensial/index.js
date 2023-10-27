const open_page = require("../../../open_page");
const papa = require('papaparse')
const path = require('path')
const fs = require('fs')
require('colors')

let page;
module.exports = async function (name) {
    if (!page) {
        page = await open_page()
    }

    try {
        await page.goto(`https://id.wikipedia.org/wiki/Pemilihan_umum_Gubernur_${name.replace(" ", "_")}_2024`)
        const data = await page.evaluate(() => {
            const ulElement = document.evaluate('//*[@id="mw-content-text"]/div[1]/ul[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const items = Array.from(ulElement.querySelectorAll('li')).map((li) => li.textContent);
            const hasil = items.map((v) => ({
                name: v.split(',')[0],
                status: v.split(',')[1]
            }))
            return [...hasil];
        });

        const h = papa.unparse(data, { header: true })
        fs.writeFileSync(path.join(__dirname, `../../../output/gubernur_potensial/gubernur_potensial_${name.replace(" ", "_")}.csv`), h)
        console.log(name, "success".green)
    } catch (error) {
        fs.appendFileSync(path.join(__dirname, "./../../../output/gubernur_potensial/exclude.txt"), name)
        console.log(`https://id.wikipedia.org/wiki/Pemilihan_umum_Gubernur_${name.replace(" ", "_")}_2024`.red)
        console.log(`${error}`.gray)
    }
}