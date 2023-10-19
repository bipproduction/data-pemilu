const get_bupati = require("./src/bupati")
const papa = require('papaparse')
const fs = require('fs')
const prov = require('./assets/gubernur.json')
require('colors')
const _ = require('lodash')

async function main() {
    const list_prov = prov.map((v) => v.Provinsi)
    for (let a of list_prov) {
        try {
            await get_bupati(`https://id.wikipedia.org/wiki/Daftar_kepala_daerah_dan_wakil_kepala_daerah_petahana_di_${a.replace("DKI Jakarta", "Daerah_Khusus_Ibukota_Jakarta")
            .replace('DI Yogyakarta', 'Daerah_Istimewa_Yogyakarta')
            .replace(" ", "_")}`, a.replace(" ", "_"))
            await new Promise(r => setTimeout(r, 1000))
        } catch (error) {
            console.log(`error ${a}`)
        }

    }
}

main()