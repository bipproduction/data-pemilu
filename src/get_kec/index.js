const { Prisma, PrismaClient } = require("@prisma/client");
const select_wilayah = require("../select_wilayah");
const click_wilayah = require("../click_wilayah");
const get_table = require("../get_table");
const prisma = new PrismaClient()
require('colors')

module.exports = async function get_kec(page) {
    console.log(`
    -----------------
    MENDAPATKAN
    DATA
    KECAMATAN
    -----------------
    `.cyan)
    await page.goto('https://pemilu2019.kpu.go.id/#/dprri/hitung-suara/');
    await new Promise(r => setTimeout(r, 3000))

    const listProv = await prisma.prov.findMany({
        orderBy: {
            urut: "asc"
        }
    })

    const pointer = await prisma.pointer.findUnique({ where: { id: 1 } })

    if (pointer.prov === 35) return console.log(`
    Data Kecamatan Success
    Note: Tanpa + Luar Negri
    `)

    await select_wilayah(page)
    console.log("prov")
    const prov = listProv[pointer.prov]

    // const namaProv = listProv[pointer.prov].WILAYAH
    // const idProv = listProv[pointer.prov].id

    const listKab = await prisma.kab.findMany({
        where: {
            provId: prov.id
        },
        orderBy: {
            urut: "asc"
        }
    })

    console.log(`
    Total Prov: ${listProv.length}
    Total Kab: ${listKab.length}

    pointer prov : ${pointer.prov}
    pointer kab : ${pointer.kab}
    `)
    await click_wilayah(page, prov.WILAYAH)

    console.log("kab")
    const kab = listKab[pointer.kab]

    const list_skip = [
        "ENDE", 
        "ALOR", 
        "GOWA", 
        "JENEPONTO", 
        "KEPULAUAN SELAYAR", 
        "KOTA JAYAPURA", 
        "MAMBERAMO RAYA",
        "Beirut, Lebanon",
        "Sana'a, Yaman",
        "BOLAANG MONGONDOW SELATAN",
        "LANNY JAYA",
        "Beijing, Republik Rakyat Tiongkok",
        "GUNUNGSITOLI ALO'OA",
        "SUBANG",
        "CONGGEANG"
    ]
    if (list_skip.includes(kab.WILAYAH)) {
        await prisma.pointer.update({
            where: {
                id: 1
            },
            data: {
                kab: pointer.kab + 1
            }
        })
        return await get_kec(page)
    }
    if (!kab) {
        console.log("data kab tidak ditemukan, reload".red)
        await get_kec(page)
    }

    await click_wilayah(page, kab.WILAYAH)

    let hasil = await get_table(page)
    hasil = hasil.map((v, k) => ({
        id: `${listProv[pointer.prov].id}${listKab[pointer.kab].id}${k + 1}`,
        kabId: `${listKab[pointer.kab].id}`,
        urut: (k + 1),
        ...v
    }))

    console.log("simpan data kec")

    for (let h of hasil) {
        await prisma.kec.upsert({
            where: {
                id: h.id
            },
            update: {
                ...h
            },
            create: {
                ...h,
            }
        })
    }

    console.log("simpan data kec success")

    if (prov.WILAYAH === "+Luar Negeri" && pointer.kab === (listKab.length - 1)) return console.log(`
        AMBIL DATA KECAMATAN COMPLETED
    `.green)


    if (pointer.kab === (listKab.length - 1)) {
        await prisma.pointer.update({
            where: {
                id: 1
            },
            data: {
                prov: pointer.prov + 1,
                kab: 0
            }
        })

        return await get_kec(page)

    }

    await prisma.pointer.update({
        where: {
            id: 1
        },
        data: {
            kab: (pointer.kab + 1)
        }
    })

    return await get_kec(page)
}