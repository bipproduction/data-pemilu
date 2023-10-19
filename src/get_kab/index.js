const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const get_table = require('../get_table')
const prisma = new PrismaClient()
const _ = require("lodash")
const clear_filter = require('../clear_filter')
const click_wilayah = require('../click_wilayah')
module.exports = async function get_kab(page) {
    console.log(`
    -------------------
    GET DATA KABUPATEN
    -------------------
    `.cyan)
    await clear_filter(page)
    const prov = await prisma.prov.findMany({
        orderBy: {
            urut: "asc"
        }
    })

    const pointer = await prisma.pointer.findUnique({ where: { id: 1 } })
    if (pointer.prov === 35) return console.log(`
    Ambil data Kabupaten success
    Note: Tanpa +Luar Negeri
    `)
    console.log("pinter prov: ".yellow, pointer.prov)
    const nama_prov = prov[pointer.prov].WILAYAH


    await click_wilayah(page, nama_prov)
    let hasil = await get_table(page)
    hasil = hasil.map((v, k) => ({
        urut: (k + 1),
        id: `${prov[pointer.prov].id}${k + 1}`,
        provId: prov[pointer.prov].id,
        ...v
    }))
    console.log(`kab total: ${hasil.length}`)

    for (let h of hasil) {
        await prisma.kab.upsert({
            where: {
                id: h.id
            },
            update: {
                ...h
            },
            create: {
                ...h
            }
        })
    }

    console.log("SAVE KAB SUCCESS".green)
    if (pointer.prov < prov.length) {
        await prisma.pointer.update({
            where: {
                id: 1
            },
            data: {
                prov: (pointer.prov + 1)
            }
        })

        return await get_kab(page)

    } else {
        console.log(`
        -------------------
        DATA KAB SELESAI
        -------------------
        `)
    }




    // const pointer = await prisma.pointer.findUnique({ where: { id: 1 } })
    // if (!pointer) await prisma.pointer.create({ data: { pos: 0 } })
    // const data = await prisma.prov.findMany({
    //     orderBy: {
    //         id: "asc"
    //     }
    // })

    // console.log(`temukan tombol ${data[pointer.prov].WILAYAH}`)
    // const [button] = await page.$x(`//button[contains(., '${data[pointer.prov].WILAYAH.replace("+", "")}')]`);
    // if (button) {
    //     console.log(`click ${data[pointer.prov].WILAYAH}`.yellow)
    //     await button.click();

    //     const hasil = await get_table(page)
    //     const hasil2 = hasil.map((v, k) => ({
    //         urut: +(data[pointer.prov].id+""+(k + 1)),
    //         id: `${data[pointer.prov].id}${k + 1}`,
    //         provId: data[pointer.prov].id,
    //         ...v
    //     }))

    //     console.log(`menyimpan kab total ${hasil2.length}`)
    //     for (let h2 of hasil2) {
    //         h2.id = `${data[pointer.prov].id}${h2.id}`
    //         await prisma.kab.upsert({
    //             where: {
    //                 id: h2.id
    //             },
    //             create: {
    //                 ...h2
    //             },
    //             update: {
    //                 ...h2
    //             }
    //         })
    //     }

    //     if (pointer.prov < (data.length - 1)) {
    //         await prisma.pointer.update({
    //             where: {
    //                 id: 1
    //             },
    //             data: {
    //                 prov: (pointer.prov + 1)
    //             }
    //         })


    //         await clear_filter(page)
    //         return await get_kab(page)
    //     } else {
    //         console.log("data lengkap")
    //     }


    // } else {
    //     console.log("Tombol tidak Ditemukan ".red)
    //     await clear_filter(page)
    //     await new Promise(r => setTimeout(r, 3000))
    //     return await get_kab(page)
    // }


}