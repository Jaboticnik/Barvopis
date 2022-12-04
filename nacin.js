import {prikazObvestila} from "./orodja.js";

const Gumb = document.getElementById("sprememba-nacina")
const Telo = document.querySelector("body")

const mozneVrednosti = ["svetlo", "temno"]

const preveriObstojecoVrednost = () => {
    let veljavnost = false
    let koncnaVrednost = "svetlo"
    if (localStorage.getItem("nacin")) {
        mozneVrednosti.map(vrednost => {
            if (vrednost === JSON.parse(localStorage.getItem("nacin"))) {
                veljavnost = true
            }
        })
    }
    if (veljavnost) {
        koncnaVrednost = koncnaVrednost !== JSON.parse(localStorage.getItem("nacin"))
            && JSON.parse(localStorage.getItem("nacin"))
    }else {
        if (localStorage.getItem("nacin")) {
            prikazObvestila("Obnovitev privzetih vrednosti!","🔄", 2000)
        }
    }
    return koncnaVrednost
}

let Nacin = preveriObstojecoVrednost()

const preveriNacin = (spremenjeno = false) => {
    if (Nacin === "temno") {
        Telo.classList.add("temni-nacin")
    }
    else if (spremenjeno) {
        Telo.classList.remove("temni-nacin")
    }
    localStorage.setItem("nacin", JSON.stringify(Nacin))
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem("nacin")) {
        Nacin = "temno"
        preveriNacin()
    }
}

Gumb.addEventListener('click', () => {
    Nacin === "svetlo" ? Nacin = "temno" : Nacin = "svetlo"
    preveriNacin(true)
})

preveriNacin()