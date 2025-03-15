// menu-data.ts
export const menuDataPro: { [key: string]: Object | null }[] = [
    { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
    // { id: 'prip_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'priprema' },
    // { id: 'prip_putninalog_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'priprema' },     
    { id: 'gp_priprema_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'priprema' },   
    { id: 'gp_priprema_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'priprema' },            
    { id: 'otvoreni_pn', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
    // { id: 'ot_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },
    // { id: 'ot_putninalog_proforma', text: 'Putni nalozi - PROFORMA', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },
    { id: 'gp_otvoren_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },   
    { id: 'gp_otvoren_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },           
    { id: 'storno_pn', text: 'Storno naloga', iconCss: 'em-icons-mod e-priprema', parentId: null },
    // { id: 'st_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'storno_pn' },             
    // { id: 'st_putninalog_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'storno_pn' },
    { id: 'gp_storno_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'storno_pn' },   
    { id: 'gp_storno_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'storno_pn' },                        
    // { id: 'ot_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },                                  
    // { id: 'prip_putninalog_ext', text: 'Putni nalog-eksterni', iconCss: 'em-icons e-file', parentId: 'priprema' },        
    { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
    { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
    { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' } 
    // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
    // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
    // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
];