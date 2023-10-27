const get_page = require("../../../src/get_page")
const html = require('html-table-to-json')
const _ = require('lodash')
const papa = require('papaparse')
const fs = require('fs')
const open_page = require("../../../open_page")
require('colors')
let page;

module.exports = async function (url, name) {
    if (!page) {
        page = await open_page()
    }

    await page.goto(url)

    const data = await page.evaluate(() => {
        const table = document.querySelector('table.wikitable');
        return table ? table.outerHTML : null;
    })

    const list = html.parse(data).results
    let hasil = []
    for (let a of list[0]) {
        const b = _.values(a)
        const r = {}
        let idx = 0;
        for (let c of b) {
            r[`c_${idx}`] = c
            idx++;
        }

        const itm = {
            wilayah: r['c_2']
                .replace('Daftar Wali Kota/Wakil Wali Kota', '')
                .replace('Daftar Bupati/Wakil Bupati', '')
                .replace('Kota', 'Kota ')
                .replace('Kabupaten', 'Kabupaten '),
            bupati: r['c_5'],
            wakil: r['c_8']
        }
        hasil.push(itm)
    }

    const maka = papa.unparse(hasil, { header: true })
    fs.writeFileSync(`./output/bupati/list_bupati_${name}.csv`, maka)
    console.log('success!'.green)
}