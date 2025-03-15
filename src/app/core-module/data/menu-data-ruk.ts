// menu-data.ts
export const menuDataRuk: { [key: string]: Object | null }[] = [
    { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
    { id: 'prip_putninalog', text: 'Putni nalog', iconCss: 'em-icons e-file', parentId: 'priprema' },
    //{ id: 'prip_predlosci', text: 'Predlošci', iconCss: 'em-icons-mod e-predlosci', parentId: 'priprema' },
    { id: 'obracun', text: 'Obračun', iconCss: 'em-icons-mod e-obracun', parentId: null },
    { id: 'obr_izvoputu', text: 'Izvještaj o putu', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'obracun' },
    // { id: 'obr_provjera', text: 'Provjera naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'obracun' },        
    { id: 'odobravanje', text: 'Potpisivanje', iconCss: 'em-icons-mod e-odobravanje', parentId: null },
    { id: 'odob_epotpis1', text: 'Otvoreni putni nalozi', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },
    { id: 'odob_epotpis2', text: 'Obračunati putni nalozi', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },    
    { id: 'epotpis2', text: 'Pregled izdatih potpisa', iconCss: 'em-icons e-file', parentId: 'odobravanje' },             
    // { id: 'odob_key', text: 'Privatni ključ', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },        
    { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
    { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
    { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }                 
    // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null }
    // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
    // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
];