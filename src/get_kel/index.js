const { Page } = require("puppeteer");
const { PrismaClient } = require('@prisma/client');
const select_wilayah = require("../select_wilayah");
const click_wilayah = require("../click_wilayah");
const get_table = require("../get_table");
const clear_filter = require("../clear_filter");
const prisma = new PrismaClient()
const fs = require('fs')
const _ = require('lodash')
/**
 * 
 * @param {Page} page 
 */
module.exports = async function get_kel(page) {

    // tambahan untuk mengatasi error 
    await page.goto('https://pemilu2019.kpu.go.id/#/dprri/hitung-suara/');
    await new Promise(r => setTimeout(r, 3000))

    const pointer = await prisma.pointer.findUnique({ where: { id: 1 } })
    const p_info = _.keys(_.omit(pointer, ['id'])).map((v) => ({
        name: v,
        pointer: pointer[v]
    }))

    console.log("POINTER ATAS".cyan)
    console.table(p_info)

    const list_prov = await prisma.prov.findMany({ orderBy: { urut: "asc" } })
    const prov = list_prov[pointer.prov]

    const list_kab = await prisma.kab.findMany({ where: { provId: prov.id }, orderBy: { urut: "asc" } })
    const kab = list_kab[pointer.kab]

    const list_kec = await prisma.kec.findMany({ where: { kabId: kab.id }, orderBy: { urut: "asc" } })
    const kec = list_kec[pointer.kec]

    await clear_filter(page)

    if (pointer.prov === list_prov.length) return console.log("SELESAI".red)

    // console.log(`CLICK Prov ${prov.WILAYAH}`)
    await click_wilayah(page, prov.WILAYAH)

    if (pointer.kab === (list_kab.length - 1)) {
        await prisma.pointer.update({
            where: {
                id: 1
            },
            data: {
                prov: pointer.prov + 1,
                kab: 0
            }
        })

        return await get_kel(page)
    }

    console.log(`CLICK KAB`.cyan)
    await click_wilayah(page, kab.WILAYAH)

    if (pointer.kec === (list_kec.length - 1)) {
        await prisma.pointer.update({
            where: {
                id: 1
            },
            data: {
                kab: pointer.kab + 1,
                kec: 0
            }
        })

        return await get_kel(page)
    }

    console.log(`CLICK KEC`.cyan)
    const list_replace = [
        {
            target: "GUNUNGSITOLI ALO'OA",
            result: "GUNUNGSITOLI"
        }
    ]
    const cari = list_replace.find((v) => v.target === kec.WILAYAH)
    const nama_kec = cari ? cari.result : kec.WILAYAH

    const list_skip = ["ARGAPURA"]
    if (list_skip.includes(nama_kec)) {
        await prisma.pointer.update({
            where: {
                id: 1
            },
            data: {
                kec: pointer.kec + 1
            }
        })
        return await get_kel(page)
    }


    await click_wilayah(page, nama_kec)

    let hasil = await get_table(page)

    hasil = hasil.map((v, k) => ({
        id: `${prov.id}${kab.id}${kec.id}${k + 1}`,
        kecId: kec.id,
        urut: k + 1,
        ...v
    }))

    const pointer_info = [
        {
            name: "prov",
            length: list_prov.length,
            pointer: pointer.prov
        },
        {
            name: "kab",
            length: list_kab.length,
            pointer: pointer.kab
        },
        {
            name: "kec",
            length: list_kec.length,
            pointer: pointer.kec
        },
        {
            name: "kel",
            length: hasil.length,
            pointer: null
        }
    ]

    console.log("POINTER BAWAH".cyan)
    console.table(pointer_info)


    try {
        for (let h of hasil) {
            await prisma.kel.upsert({
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
    } catch (error) {
        fs.appendFileSync('log_skip_kec.txt', kec.WILAYAH)
        console.log(`error simpan data ${kec.WILAYAH}`.red)
    }

    await prisma.pointer.update({
        where: {
            id: 1
        },
        data: {
            kec: pointer.kec + 1
        }
    })


    return await get_kel(page)

}