const get_page = require('./src/get_page');
const get_kab = require('./src/get_kab');
const get_prov = require('./src/get_prov');
const get_kec = require('./src/get_kec');
const get_kel = require('./src/get_kel');
require('colors');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const arg = process.argv.splice(2);

const list_cmd = [
    {
        name: "--prov",
        des: "get province",
        act: get_prov
    },
    {
        name: "--kab",
        des: "get kabupaten",
        act: get_kab
    },
    {
        name: "--kec",
        des: "get kecamatan",
        act: get_kec
    },
    {
        name: "--kel",
        des: "get kelurahan",
        act: get_kel
    },
    {
        name: "--resp",
        des: "reset pointer",
        act: reset_pointer
    }
];

; (async () => {
    const page = await get_page()
    const act = list_cmd.find((v) => v.name === arg[0])
    if (!act) return console.log(
        `
        Usage : node index.js --<option>
        Options :
        ${list_cmd.map((v) => v.name + "\t\t" + v.des).join("\n\t")}
        `
    )

    await act.act(page)

})();


async function reset_pointer(page) {
    await prisma.pointer.update({
        where: { id: 1 },
        data: {
            prov: 0,
            kab: 0,
            kec: 0
        }
    })

    console.log("SUCCESS".green)
    process.exit(0)
}