
const { CheerioTableParser } = require('html-tables-to-json');
const html = new CheerioTableParser();
const _ = require('lodash');
const fs = require('fs');
const { convertTableDataToJSON } = require('table-data-to-json');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('colors')
const { createId } = require('@paralleldrive/cuid2')

module.exports = async function (page) {
    await new Promise(r => setTimeout(r, 1000))
    // Ambil HTML dari elemen tabel dan ubah menjadi string
    console.log("mendapatkan data table")
    const tableHTML = await page.$eval('.table', (table) => {
        return table.outerHTML;
    });

    const r = html.parse(tableHTML)
    /**
     * @type {any[]}
     */
    const hasil = convertTableDataToJSON(_.flatten(r)).map((v, k) => ({
        ..._.omit(v, ['WILAYAH']),
        WILAYAH: v.WILAYAH.replace(/\s\(\d+,\d+%\)/, '').replace(/\s\(\d+\d+%\)/, '').trim()
    }))

    return hasil
}