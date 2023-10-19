const { fetch } = require('cross-fetch')

fetch("http://localhost:5012/io", {
    method: "POST",
    body: JSON.stringify({
        id: "hipmi",
        path: "/",
        data: "selamat anda mendapat notifikasi baru",
    }),
    headers: {
        "Content-Type": "application/json",
    },
}).then(async (v) => {
    // const data = await v.json();
    console.log(await v.text());
});