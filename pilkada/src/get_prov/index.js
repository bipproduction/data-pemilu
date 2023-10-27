const open_page = require("../../../open_page");
// const cheerio = require('cheerio');
const html = require('html-table-to-json')
const papa = require('papaparse')
const fs = require('fs')
const path = require('path');
let page;

module.exports = async function () {
    if (!page) {
        page = await open_page()
    }

    await page.goto('https://id.wikipedia.org/wiki/Provinsi_di_Indonesia')
    // const pageContent = await page.content();
    const tableHTML = await page.evaluate(() => {
        return document.querySelector('.wikitable').outerHTML; // Ganti 'wikitable' dengan kelas tabel yang Anda inginkan
    });

    const a = html.parse(tableHTML).results.flat()

    const hasil = a.map((v, a) => ({
        prov: v.Umum
    }))

    fs.writeFileSync(path.join(__dirname, "./../../assets/list_48_province.json"), JSON.stringify(hasil, null, 2), "utf-8")
    console.log("success")

    // console.log(hasil, hasil.length)

    // const hasil = a.map((v, k) => ({
    //     id: (k + 1),
    //     prov: v['Provinsi'].replace('\nDaftar Gubernur / Wakil Gubernur', ''),
    //     gub: v['Foto Wakil Gubernur'],
    //     wagub: v['Selesai menjabat(Direncanakan)']??"null"
    // }))

    // const p = papa.unparse(hasil, {header: true})
    // fs.writeFileSync(path.join(__dirname, './../../../output/gubernur/gub_now.csv'), p)
    // console.log("success")

}