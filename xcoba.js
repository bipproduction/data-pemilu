const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const _ = require('lodash')
const papa = require('papaparse')
const fs = require('fs')

async function main() {
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
    fs.writeFileSync('data_leg.csv', csv, "utf-8")
    console.log("success")

}

main()
