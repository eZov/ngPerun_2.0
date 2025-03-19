// menu-data.ts
export const menuDataUprFin: { [key: string]: Object | null }[] = [
    { id: 'odobravanje', text: 'Odobravanje', iconCss: 'em-icons-mod e-odobravanje', parentId: null },
    { id: 'obr_obracun', text: 'Obračuni', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },
    { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
    { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
    { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }         
];