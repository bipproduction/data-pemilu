const get_bupati = require("./src/bupati")
const prov = require('./assets/gubernur.json')
require('colors')
const _ = require('lodash')
const ls_province = require('./assets/list_province.json')
const gubernur_potensial = require("./src/gubernur_potensial")
const prov_kab = require('./assets/prov_kab.json')
const bupati_potensial = require("./src/bupati_potensial")
const gub_now = require('./assets/gub_now.json')
const get_gubernur_wakil = require("./src/get_gubernur_wakil")
const get_prov = require("./src/get_prov")
const list_48_province = require('./assets/list_48_province.json')

async function main() {
    await get_gubernur_potensial()
    // await get_bupati_potensial()

    // await gubernur_indonesia()

    // await get_prov()
}


async function get_bupati_potensial() {
    for (let a of prov_kab) {
        for (let b of a.kab) {
            await bupati_potensial(b, a.prov)
        }
    }
}

async function get_gubernur_potensial() {
    for (let ls of list_48_province.map((v) => v.prov)) {
        await gubernur_potensial(ls)
    }
}


async function get_data_bupati() {
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

async function gubernur_indonesia(){
    await get_gubernur_wakil()
}

main()