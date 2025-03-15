// menu-data.ts
export const menuDataDir: { [key: string]: Object | null }[] = [
    // { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
    // { id: 'prip_putninalog', text: 'Putni nalog', iconCss: 'em-icons e-file', parentId: 'priprema' },
    // { id: 'prip_predlosci', text: 'Predlošci', iconCss: 'em-icons-mod e-predlosci', parentId: 'priprema' },
    { id: 'odobravanje', text: 'Potpisivanje', iconCss: 'em-icons-mod e-odobravanje', parentId: null },
    { id: 'odob_epotpis1', text: 'Otvoreni putni nalozi', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },
    { id: 'odob_epotpis2', text: 'Obračunati putni nalozi', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },   
    { id: 'epotpis2', text: 'Pregled izdatih potpisa', iconCss: 'em-icons e-file', parentId: 'odobravanje' },         
    // { id: 'odob_epotpis3', text: 'Sedmični pregled potpisanih naloga', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },                       
    { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
    { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
    { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }         
    // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
    // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
    // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
];    
