const fs = require('fs')


const text = fs.readFileSync('./xnote.md').toString();

const lines = text.trim().split('\n');
const hasil = [];
let currentProv = '';
let currentKab = [];

for (const line of lines) {
    if (line.includes('Pemilihan umum')) {
        currentKab.push(line.replace('Pemilihan umum ', ''));
    } else {
        if (currentKab.length > 0) {
            hasil.push({ "prov": currentProv, "kab": currentKab });
        }
        currentProv = line;
        currentKab = [];
    }
}

// Menambahkan yang terakhir
if (currentKab.length > 0) {
    hasil.push({ "prov": currentProv, "kab": currentKab });
}

fs.writeFileSync('./pilkada/assets/prov_kab.json', JSON.stringify(hasil))
console.log("success")

// console.log(hasil);