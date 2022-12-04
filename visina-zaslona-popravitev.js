const visinaZaslona = () => {
    const Zaslon = document.documentElement
    Zaslon.style.setProperty('--visina-zaslona', `${window.innerHeight}px`)
}
window.addEventListener('resize', visinaZaslona)
visinaZaslona()
