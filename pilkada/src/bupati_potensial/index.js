const open_page = require("../../../open_page");
const fs = require('fs')
const papa = require('papaparse')
const path = require('path')
let page;
const _ = require('lodash')
require('colors')

module.exports = async function (name, prov) {
    console.log(_.snakeCase(_.startCase(name)))
    if (!page) {
        page = await open_page()
    }
    try {
        await page.goto(`https://id.wikipedia.org/wiki/Pemilihan_umum_${name.replace(/ /g, "_")}`)
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
        fs.writeFileSync(path.join(__dirname, `../../../output/bupati_potensial/bupati_potensial_${prov.replace(/ /g, "_")}-${name.replace(/ /g, "_")}.csv`), h)
        console.log(name, "success".green)
    } catch (error) {
        fs.appendFileSync(path.join(__dirname, `../../../output/bupati_potensial/exclude.txt`), `${prov}-${name}\n`)
        console.log(error)
        console.log(`https://id.wikipedia.org/wiki/Pemilihan_umum_${name.replace(/ /g, "_")}`.red)
    }

}