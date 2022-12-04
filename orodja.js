import Izbor from "./Izbor.js";


const obnoviBarve = (steviloBarv, podatkiBarve = false, okostje = false) => {
    const nizNovihBarv = new Array(0)
    for (let i = 1; i <= steviloBarv; i++) {
        if (!okostje && podatkiBarve) {
            nizNovihBarv.push(`
           <div class="prikazna-barva" id="barvopis-barva-${i}">
            <div class="prikazajoca-se-barva" style="background-color: ${podatkiBarve[`barva${i}`]}"></div>
            <button aria-controls="shrani barvo v odložišče" class="napis-barve">${podatkiBarve[`barva${i}`]}</button>
           </div>`
            )
        }else {
            nizNovihBarv.push(`
           <div class="prikazna-barva" id="barvopis-barva-${i}">
            <div class="okostje prikazajoca-se-barva"></div>
            <div class="okostje okostje-besedilo"></div>
            <div class="okostje okostje-besedilo"></div>
           </div>`
            )
        }
    }
    if (document.getElementById(Izbor.NosilecOdtenkovHTML)) {
        document.getElementById(Izbor.NosilecOdtenkovHTML).innerHTML = nizNovihBarv.join('')
    }else {
        setTimeout(() => location.reload(),2000)
        throw new Error(`V HTML-ju manjka element z id-jem ${Izbor.NosilecOdtenkovHTML}`)
    }
}

const shraniVLocalstorage = (ime, barva, nacin) => {
    const vrednost =JSON.stringify({
        barva: barva,
        nacin: nacin
    })

    localStorage.setItem(ime, vrednost)
}

const preglejLocalstorage = (ime) => {
    const Vrednost = JSON.parse(localStorage.getItem(ime))
    return Vrednost ? Vrednost : false
}

const prikazObvestila = (besedilo, smesko, cas) => {
    const Obvestilo = document.createElement('div')
    Obvestilo.classList.add('obvestilo')
    const Vsebina = document.createElement('p')
    Vsebina.classList.add('besedilo-obvestila')
    Vsebina.textContent = `${smesko} ${besedilo}`
    Obvestilo.appendChild(Vsebina)
    document.querySelector('body').appendChild(Obvestilo)

    setTimeout(() => {
        Obvestilo.classList.add('izbris-obvestila')
        setTimeout(() => {
            document.querySelector('body').removeChild(Obvestilo)
        }, 500)
    }, cas)
}

const prehodOkostja = (izbris = false) => {
    let Vnosni_podatki = {}
    if (izbris) {
        Vnosni_podatki = {
            Odstranitveni_clen : 'okostje-besedilo',
            Barvi_dodan_razred : false,
            Barvi_odstranjen_razred: 'okostje',
            NoviClen : 'button',
            Razred_novega_clena : 'napis-barve',
            znacilnost : true,
            podvojitev_novega_clena : false,
            moteci_clen: "napis-barve"
        }
    }else if (!izbris){
        Vnosni_podatki =  {
            Odstranitveni_clen : 'napis-barve',
            Barvi_dodan_razred : 'okostje',
            Barvi_odstranjen_razred: false,
            NoviClen : 'div',
            Razred_novega_clena : 'okostje',
            Razred_novega_clena2 : 'okostje-besedilo',
            znacilnost : false,
            podvojitev_novega_clena : true,
            moteci_clen: "okostje-besedilo"
        }
    }

    document.querySelectorAll(`${Izbor.PrikaznaBarvaNosilec}`).forEach((clen) => {

        //Izbrise ze obstojece nove predmete, ce slucajno obstajajo, da prepreci podvojitev
        document.querySelectorAll(`#${clen.id} .${Vnosni_podatki.moteci_clen}`).forEach((izbranClen) => {
            izbranClen.remove()
        })

        document.querySelectorAll(`#${clen.id} .${Vnosni_podatki.Odstranitveni_clen}`).forEach((izbranClen) => {
            izbranClen.remove()
        })

        const BarveHTML = document.querySelector(`#${clen.id} .prikazajoca-se-barva`)
        if (Vnosni_podatki.Barvi_odstranjen_razred) {
            BarveHTML.classList.remove(Vnosni_podatki.Barvi_odstranjen_razred)
        }

        if (Vnosni_podatki.Barvi_dodan_razred) {
            BarveHTML.classList.add(Vnosni_podatki.Barvi_dodan_razred)
            BarveHTML.style = "none"
        }
        const NoviClen = document.createElement(Vnosni_podatki.NoviClen)
        NoviClen.classList.add(Vnosni_podatki.Razred_novega_clena)
        Vnosni_podatki.Razred_novega_clena2 && NoviClen.classList.add(Vnosni_podatki.Razred_novega_clena2)

        const NoviClen2 = Vnosni_podatki.podvojitev_novega_clena && NoviClen.cloneNode()
        clen.appendChild(NoviClen)
        Vnosni_podatki.podvojitev_novega_clena && clen.appendChild(NoviClen2)

    })
}

export {obnoviBarve, shraniVLocalstorage, preglejLocalstorage, prikazObvestila, prehodOkostja}