// menu-data.ts
export const menuDataUpo: { [key: string]: Object | null }[] = [
    { id: 'evidencije', text: 'Evidencije', iconCss: 'em-icons-mod e-priprema', parentId: null },
    //{ id: 'evid_dnevnik', text: 'Dnevnik rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' },      
    { id: 'evid_dnevnik2', text: 'Dnevnik rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' },         
    { id: 'evid/evid_calendar', text: 'Kalendar rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' },
    // { id: 'priprema', text: 'Moji putni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
    // { id: 'prip_putninalog', text: 'Priprema i odobreni', iconCss: 'em-icons e-file', parentId: 'priprema' },
    // { id: 'obr_izvoputu', text: 'Izvještaj o putu', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'priprema' },
    // { id: 'pregled', text: 'Pregled putnih naloga', iconCss: 'em-icons-mod e-priprema', parentId: 'priprema' },        
    // { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
    // { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }, 
    { id: 'epotpis', text: 'Elektronski potpis', iconCss: 'em-icons-mod e-priprema', parentId: null },
    { id: 'epotpis1', text: 'Priprema potpisa', iconCss: 'em-icons e-file', parentId: 'epotpis' },              
    { id: 'help_manual', text: 'Uputstvo', iconCss: 'em-icons-mod e-predlosci', parentId: null },           
    { id: 'help_dnrada', text: 'Dnevnik rada', iconCss: 'em-icons-mod e-predlosci', parentId: 'help_manual' },
    // { id: 'help_mperun', text: 'Mobilna aplikacija mPerun', iconCss: 'em-icons-mod e-predlosci', parentId: 'help_manual' }                  
];
