import './nacin.js'
import './visina-zaslona-popravitev.js'
import PrikazovalnikBarv from "./PrikazovalnikBarv.js";
import Izbor from "./Izbor.js";

//Prikaz prehoda ob pritisku gumba
function prehodGumba() {
    GumbPotrdiHTML.classList.add("zacniprehod")
    setTimeout(() => {
        GumbPotrdiHTML.classList.remove("zacniprehod")
    }, 500)
}

// HTML vnosi
const GumbPotrdiHTML = document.getElementById(Izbor.GumbPotrdiHTML)
const VnosnikBarveHTML = document.getElementById(Izbor.VnosnikBarveHTML)
const IzbirnikHTML = document.getElementById(Izbor.IzbirnikHTML)


const prikazovalecBarv = new PrikazovalnikBarv()

//Zacetni prikaz
await prikazovalecBarv.zacetek()


//Nastavitev dogodkov spremembe
GumbPotrdiHTML.addEventListener('click', async () => {
    prehodGumba()
    await prikazovalecBarv.koncniPostopek()
    document.activeElement.blur()
})

VnosnikBarveHTML.addEventListener('change', async() => {
    await prikazovalecBarv.koncniPostopek()
})

IzbirnikHTML.addEventListener('change', async() => {
    await prikazovalecBarv.koncniPostopek()
})

//Shrani v odlozice
document.querySelectorAll(Izbor.NapisiBarvHTML).forEach((element, stevilo) => {
    element.addEventListener('click', () => {
        prikazovalecBarv.shraniVOdlozisce(stevilo + 1)
    })
})