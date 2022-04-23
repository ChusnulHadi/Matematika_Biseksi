"use strict";

const main = () => {
    //memanggil fungsi untuk handling file
    const fs = require('fs')

    //fungsi untuk menemukan
    const f = (value) => {
        return (667.38 / value) * (1 - value ** (-0.146843 * value)) - 40;
    }

    //inisialisasi nilai yang akan dicari
    let xu = 12;
    let xl = 10;

    //menyiapkan variabel operasi yang akan digabungkan dalam bentuk object
    const valueOf = {
        batasBawah: xl,
        batasAtas: xu,
        persamaan: null,
        functionBatasBawah: null,
        functionBatasAtas: null,
        functionPersamaan: null
    }

    //variabel yang akan menyimpan setiap hasil operasi di setiap iterasi
    const result = [];

    //variabel untuk menentukan tingkat error
    let xrlama;
    let xrbaru;
    let presicion;

    //menginisialisasikan nilai pada property
    valueOf.persamaan = (valueOf.batasAtas + valueOf.batasBawah) / 2;
    valueOf.functionPersamaan = f(valueOf.persamaan);
    valueOf.functionBatasBawah = f(valueOf.batasBawah);

    //menginisialisasikan variabel xrbaru dengan persamaan
    xrbaru = valueOf.persamaan;

    //variabel yang menyimpan nilai dari operasi f(xr) * f(xl)
    let divider = valueOf.functionPersamaan * valueOf.functionBatasBawah;

    let i = 0;
    //perulangan iterasi dengan maksimal 100 kali
    while (i < 100) {

        //mengubah nilai xrlama
        xrlama = xrbaru;

        //penugasan untuk variabel fungsi batas bawah dan batas atas
        valueOf.functionBatasBawah = f(valueOf.batasBawah);
        valueOf.functionBatasAtas = f(valueOf.batasAtas);

        if (divider < 0) { //kondisi jika f(xr) * f(xl) < 0
            //melakukan perubahan nilai xu = xr
            valueOf.batasAtas = valueOf.persamaan;
        }
        else if (divider > 0) { //kondisi jika f(xr) * f(xl) < 0
            //  melakukan perubahan nilai xl = xr
            valueOf.batasBawah = valueOf.persamaan;
        }

        //update nilai variabel lain setelah perubahan diatas
        valueOf.persamaan = (valueOf.batasAtas + valueOf.batasBawah) / 2;
        xrbaru = valueOf.persamaan;
        valueOf.functionPersamaan = f(valueOf.persamaan);
        divider = valueOf.functionPersamaan * valueOf.functionBatasBawah;

        //operasi untuk menghitung tingkat error
        presicion = (xrbaru - xrlama) / xrbaru * 100;

        //menulis log untuk setiap iterasi yang dilakukan
        console.log("Persamaan : " + valueOf.persamaan);
        console.log("Error : " + Math.abs(presicion) + "%");
        console.log("Fungsi Persamaan : " + valueOf.functionPersamaan);
        console.log(" ");

        //menambahkan hasil operasi ke array
        result.push(valueOf);

        //kondisi jika absolute error kurang dari 0.0001
        if (Math.abs(presicion) < 0.0001) {
            //menghentikan operasi
            break;
        }

        i++;
    };

    console.log("operasi berhenti, persamaan ditemukan di iterasi ke : " + i);
    console.log("Error : " + Math.abs(presicion) + "%");

    // melakukan operasi untuk mengubah hasil perhitungan menjadi lebih mudah dibaca
    const csvString = [
        [

            "Batas Bawah",
            "Batas Atas",
            "Persamaan",
            "Fungsi Batas Bawah",
            "Fungsi Batas Atas",
            "Fungsi Persamaan"
        ],
        ...result.map(item => [
            item.batasBawah,
            item.batasAtas,
            item.persamaan,
            item.functionBatasBawah,
            item.functionBatasAtas,
            item.functionPersamaan
        ])
    ]
        .map(e => e.join(","))
        .join("\n");

    //menulis hasil operasi ke dalam file result.csv
    fs.writeFile('result.csv', csvString, err => {
        if (err) console.log(err);
    })
}

main();