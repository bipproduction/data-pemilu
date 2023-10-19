const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const papa = require('papaparse')
const fs = require('fs')
const _ = require('lodash')
const args = process.argv.splice(2)
require('colors')

const list_menu = [
    {
        id: "--prov",
        act: buildProv,
        des: "untuk build provinsi"
    },
    {
        id: "--kab",
        act: buildKab,
        des: "untuk build kabupaten"
    },
    {
        id: "--kec",
        act: buildKec,
        des: "untuk build kecamatan"
    },
    {
        id: "--kel",
        act: buildKel,
        des: "untuk build kelurahan"
    },
    {
        id: "--all",
        act: buildAll,
        des: "untuk build semuanya"
    },
    {
        id: "--bulk",
        act: async () => {
            await buildProv()
            await buildKab()
            await buildKec()
            await buildKel()

        },
        des: "untuk build semuanya"
    }
]

function show_menu() {
    console.log(`
        MENU
        ----------------------------
        ${list_menu.map((v) => `${v.id} \t\t ${v.des}`).join("\n\t")}
        `)
}

async function main() {

    if (_.isEmpty(args)) {
        return show_menu()
    }

    const act = list_menu.find((v) => v.id === args[0])
    if (!act) return show_menu()

    await act.act()
    console.log("SUCCESS".green)

}

async function buildProv() {
    const list_prov = await prisma.prov.findMany()
    const target = list_prov.map((v) => ({
        prov_id: v.id,
        prov_name: v.WILAYAH
    }))

    const hasil = papa.unparse(target, { header: true })
    fs.writeFileSync('./output/prov.csv', hasil)
}

async function buildKab() {
    const list_prov = await prisma.kab.findMany({
        select: {
            id: true,
            WILAYAH: true,
            Prov: {
                select: {
                    id: true,
                    WILAYAH: true
                }
            }
        }
    })
    const target = list_prov.map((v) => ({
        kab_id: v.id,
        kab_name: v.WILAYAH,
        prov_id: v.Prov.id,
        prov_name: v.Prov.WILAYAH
    }))

    const hasil = papa.unparse(target, { header: true })
    fs.writeFileSync('./output/kab.csv', hasil)
}

async function buildKec() {
    const list_prov = await prisma.kec.findMany({
        select: {
            id: true,
            WILAYAH: true,
            Kab: {
                select: {
                    id: true,
                    WILAYAH: true,
                    Prov: {
                        select: {
                            id: true,
                            WILAYAH: true
                        }
                    }
                }
            }
        }
    })
    const target = list_prov.map((v) => ({
        kec_id: v.id,
        kec_name: v.WILAYAH,
        kab_id: v.Kab.id,
        kab_name: v.Kab.WILAYAH,
        prov_id: v.Kab.Prov.id,
        prov_name: v.Kab.Prov.WILAYAH
    }))

    const hasil = papa.unparse(target, { header: true })
    fs.writeFileSync('./output/kec.csv', hasil)
}

async function buildKel() {
    const list_prov = await prisma.kel.findMany({
        select: {
            id: true,
            WILAYAH: true,
            Kec: {
                select: {
                    id: true,
                    WILAYAH: true,
                    Kab: {
                        select: {
                            id: true,
                            WILAYAH: true,
                            Prov: {
                                select: {
                                    id: true,
                                    WILAYAH: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    const target = list_prov.map((v) => ({
        kel_id: v.id,
        kel_name: v.WILAYAH,
        kec_id: v.Kec.id,
        kec_name: v.Kec.WILAYAH,
        kab_id: v.Kec.Kab.id,
        kab_name: v.Kec.Kab.WILAYAH,
        prov_id: v.Kec.Kab.Prov.id,
        prov_name: v.Kec.Kab.Prov.WILAYAH
    }))

    const hasil = papa.unparse(target, { header: true })
    fs.writeFileSync('./output/kel.csv', hasil)
}

async function buildAll() {
    const list_prov = await prisma.prov.findMany({
        select: {
            id: true,
            WILAYAH: true,
            Kab: {
                select: {
                    id: true,
                    WILAYAH: true,
                    Kec: {
                        select: {
                            id: true,
                            WILAYAH: true,
                            Kel: {
                                select: {
                                    id: true,
                                    WILAYAH: true,
                                    Berkarya: true,
                                    Demokrat: true,
                                    Garuda: true,
                                    Gerindra: true,
                                    Golkar: true,
                                    Hanura: true,
                                    NasDem: true,
                                    PAN: true,
                                    PBB: true,
                                    PDIP: true,
                                    Perindo: true,
                                    PKB: true,
                                    PKPI: true,
                                    PKS: true,
                                    PPP: true,
                                    PSI: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    const hasil = []
    for (let a of list_prov) {
        for (let b of a.Kab) {
            for (let c of b.Kec) {
                for (let d of c.Kel) {
                    const data = {
                        prov_id: a.id,
                        prov_name: a.WILAYAH,
                        kab_id: b.id,
                        kab_name: b.WILAYAH,
                        kec_id: c.id,
                        kec_name: c.WILAYAH,
                        kel_id: d.id,
                        kel_name: d.WILAYAH,
                        ..._.omit(d, ['id', 'WILAYAH'])
                    }
                    hasil.push(data)
                }
            }
        }
    }

    const csv = papa.unparse(hasil)
    fs.writeFileSync('./output/all.csv', csv, "utf-8")
    console.log("success")
}

main()