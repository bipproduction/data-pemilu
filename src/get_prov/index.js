
const { CheerioTableParser } = require('html-tables-to-json');
const html = new CheerioTableParser();
const _ = require('lodash');
const fs = require('fs');
const { convertTableDataToJSON } = require('table-data-to-json');
const { PrismaClient } = require('@prisma/client');
const get_table = require('../get_table');
const prisma = new PrismaClient()
require('colors')

module.exports = async function (page) {
    console.log(`
    --------------------
    AMBIL DATA PROVINCE
    --------------------
    `.cyan)
    // Tunggu sampai elemen yang Anda cari muncul di halaman
    await page.waitForSelector('#scope-options');
    await page.click("#scope-options")
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');

    console.log("tunggu table load")
    await page.waitForSelector('.table');

    let hasil = await get_table(page)
    hasil = hasil.map((v, k) => ({
        ...v,
        urut: (k + 1),
        id: `${k + 1}`
    }))

    console.log(`simpan data province total ${hasil.length}`)
    for (let h of hasil) {
        await prisma.prov.upsert({
            where: {
                id: h.id
            },
            create: {
                ...h
            },
            update: {
                ...h
            }
        })
    }

    console.log("Prov SUCCESS".green)

}