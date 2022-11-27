import inquirer from "inquirer";
import db from "./prisma/connection.js"
import {hashPassword, comparePassword} from './utils/hashPassword.js'

console.clear()
console.log(`
===================================
APlikasi Cli 2
===================================
`)

//kasih pilhan mau login atau mau register 
inquirer.prompt([
    {
        name : "option",
        message : "silahkan pilih : ",
        type : "list",
        choices : ["login", "register", "exit"]
    }
])
.then((ans)=>{
    
    //destruct option objek dari ans
    const {option} = ans
    
    //gunakan if
    if(option==="login"){
        return login()
    }

    if(option==="register"){
        return register()
    } 

    exit()

})
.catch((err)=>{
    console.error(err)
})

//function login
function login(){
    console.clear()
    //console.log("kamu memilih login") //mulai dari sini
    inquirer.prompt([
        {
            name : 'username',
            message : 'masukan username'
        },
        {
            name : 'password',
            message : 'masukkan password : ',
            type : 'password'
        }
    ]) 
    .then(async(ans)=>{
        const {username, password} = ans
        const getUserData = await db.users.findUnique({
            where : {
                username : username
            }
        })

        //jika username tidak ditemukan
        if(!getUserData){
            return console.log("username tidak ditemukan")
        }

        //compare passwordnya
        const tryComparePassword = await comparePassword(password, getUserData.password)

        //jika password tidak seusai
        if(!tryComparePassword){
            return console.log("password salah..")
        }

        //semua sesuai 
        console.log(`
==========================================
SELAMAT DATANG ${getUserData.username}
==========================================
        `)
    })
}

//function register
function register (){
    console.clear()
    //console.log("kamu memilih Login")

    //kita masukkan inquirer disini
    inquirer.prompt([
        {
            name : "username",
            message : "Masukkan username"
        },
        {
            name : "password",
            message : "Masukkan password",
            type : "password" 
        }
    ])
    .then((ans)=>{
        const {username, password} = ans

        //masukan data ke database
        db.users.create({
            data : {
                username : username,
                password : hashPassword(password)
            }
        })
        .then((res)=>[
            console.log("data berhasil di simpan..")
        ])
        .catch((err)=>{
            console.error(err.message)
        })
    })
}

function exit (){
    console.clear()
    console.log("Terimakasih...")
}