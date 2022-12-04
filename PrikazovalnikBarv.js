import {
    obnoviBarve,
    preglejLocalstorage,
    prikazObvestila,
    shraniVLocalstorage,
    prehodOkostja
} from "./orodja.js";
import Izbor from "./Izbor.js";

// HTML vnosi
const VnosnikBarveHTML = document.getElementById(Izbor.VnosnikBarveHTML)
const IzbirnikHTML = document.getElementById(Izbor.IzbirnikHTML)

export default class PrikazovalnikBarv {
    constructor() {
        this.podatkiBarve = {}
        this.steviloBarv = Izbor.steviloBarv
        this.osnovnaBarva = ""
        this.izbranOdtenek = ""
        this.pocasnaPovezava = false
        this.mozniOdtenki = Izbor.odtenki
    }

    shraniVOdlozisce(id) {
        const Barva = this.podatkiBarve[`barva${id}`]
        navigator.clipboard.writeText(Barva)
            .then(() => {
                prikazObvestila("Uspešno shranjeno v odložišče!","✅", 2000)
            })
            .catch((napaka) => {
                prikazObvestila("Napaka pri shranjevanju v odložišče!","❌", 2000)
                throw new Error(`Napaka pri shranjevanju v odložišče: ${napaka}`)
            })

    }

    posodobitevVnosa() {
        VnosnikBarveHTML.value = `#${this.osnovnaBarva}`
        IzbirnikHTML.value = this.izbranOdtenek
    }

    pridobitevVnosa() {
        this.osnovnaBarva = VnosnikBarveHTML.value.substring(1)
        this.izbranOdtenek = IzbirnikHTML.value
        this.posodobitevVnosa()
    }

    nastavitevLocalstorage() {
        const privzetaVrednost = (barva = true, odtenek = true) => {
            if (barva) {
                this.osnovnaBarva = Izbor.osnovnaBarva
            }
            if (odtenek) {
                this.izbranOdtenek = Izbor.osnovniNacin
            }
        }

        const preveriOdtenek = () => {
            let veljavno = false
            this.mozniOdtenki.map(odtenek => {
                if (odtenek === stariPodatki.nacin) {
                    veljavno = true
                }
            })
            return veljavno
        }

        const stariPodatki = preglejLocalstorage("prilagodljivost")
        if (stariPodatki) {
            const dovoljeniZnaki = /^[0-9A-F]{6}$/i;
            let ponastavitev = false
            if (dovoljeniZnaki.test(stariPodatki.barva)) {
                this.osnovnaBarva = stariPodatki.barva
            } else {
                ponastavitev = true
                privzetaVrednost(true, false)
            }

            if (preveriOdtenek()) {
                this.izbranOdtenek = stariPodatki.nacin
            } else {
                ponastavitev = true
                privzetaVrednost(false, true)
            }

            if (ponastavitev) {
                prikazObvestila("Obnovitev privzetih vrednosti!","🔄", 2000)
            }

        }else {
            privzetaVrednost()
        }

        this.posodobitevVnosa()
    }

     async nastavitevBarvAPI() {
        await fetch(`https://www.thecolorapi.com/scheme?hex=${this.osnovnaBarva}&mode=${this.izbranOdtenek}&count=${this.steviloBarv}`, {
            method: "GET",
        })
            .then(odziv => odziv.json())
            .then(nizVrednosti => {
                nizVrednosti.colors.map((element, stevilo) => {
                    const i = stevilo + 1
                    this.podatkiBarve[`barva${i}`] = element.hex.value
                })
            })
            .catch(() => {
                prikazObvestila("Napaka pri povezavi s strežnikom!","❌", 2000)
                throw new Error("Napaka pri povezavi s strežnikom")
            })
    }

    prikazHTML() {
        shraniVLocalstorage("prilagodljivost", this.osnovnaBarva, this.izbranOdtenek)
        const steviloBarv = this.steviloBarv
        for (let i = 1; i <= steviloBarv; i++) {
            if (document.querySelector(`#barvopis-barva-${i} .prikazajoca-se-barva`) && document.querySelector(`#barvopis-barva-${i} .napis-barve`)) {
                document.querySelector(`#barvopis-barva-${i} .prikazajoca-se-barva`).style.backgroundColor = this.podatkiBarve[`barva${i}`]
                document.querySelector(`#barvopis-barva-${i} .napis-barve`).innerHTML = this.podatkiBarve[`barva${i}`]
            }else {
                obnoviBarve(this.steviloBarv, this.podatkiBarve)
            }
        }

    }

    async pocasniNacin() {
        let Pocasnost = false
        prehodOkostja()
        const Casovnik = setTimeout(() => {
            Pocasnost = true
        }, 1300)
        await this.nastavitevBarvAPI()
        clearTimeout(Casovnik)

        setTimeout(() => {
            if (!Pocasnost) {
                this.pocasnaPovezava = false
            }
            !Pocasnost && prikazObvestila("Vključen način hitre povezave!","🔄", 2000)
            prehodOkostja(true)
            this.prikazHTML()
        }, 1000)
    }

    async zacetek() {
        this.nastavitevLocalstorage()
        const Casovnik = setTimeout(() => {
            prikazObvestila("Vključen način počasne povezave!","🔄", 2000)
            this.pocasnaPovezava = true
        }, 1300)
        await this.nastavitevBarvAPI()
        clearTimeout(Casovnik)
        prehodOkostja(true)
        this.prikazHTML()
    }

    async koncniPostopek() {
        let Pocasnost = false
        this.pridobitevVnosa()
        if (!this.pocasnaPovezava) {
            const Casovnik = setTimeout(() => {
                prehodOkostja()
                Pocasnost = true
            }, 1300)

            await this.nastavitevBarvAPI()

            if (!Pocasnost) {
                clearTimeout(Casovnik)
                this.prikazHTML()
            } else {
                this.pocasnaPovezava = true
                setTimeout(() => {
                    prehodOkostja(true)
                    this.prikazHTML()
                }, 1000)
            }
        }else {
            await this.pocasniNacin()
        }

    }
}
