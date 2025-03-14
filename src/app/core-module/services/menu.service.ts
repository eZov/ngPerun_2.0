
import { Injectable, Output, EventEmitter } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { MenuItemModel, MenuEventArgs, ToolbarComponent, MenuComponent } from '@syncfusion/ej2-angular-navigations';

import { RestDataSource } from "../../shared/rest.datasource";
import { PutnalDetail } from "../../model/putnaldetail.model";
import { Putnal } from "../../model/putnal.model";
import { UserSessionService } from './user-session.service';
import { LoaderService } from './loader.service';

export interface MenuItems  { [key: string]: Object | null; }
  

  @Injectable({
    providedIn: 'root'
  })
export class MenuService {


    private userLoggedIn = new Subject< { [key: string]: Object | null }[]>();
    
    public menuDataLogged!: { [key: string]: Object | null }[];

    private menuDataDef: { [key: string]: Object | null }[] = [
        { id: 'prijava', text: 'Prijava',  parentId: null }
    ];    ;

    private menuDataUpo: { [key: string]: Object| null }[] = [
        { id: 'evidencije', text: 'Evidencije', iconCss: 'em-icons-mod e-priprema', parentId: null },
        //{ id: 'evid_dnevnik', text: 'Dnevnik rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' },      
        { id: 'evid_dnevnik2', text: 'Dnevnik rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' },         
        { id: 'evid_calendar', text: 'Kalendar rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' },
        { id: 'priprema', text: 'Moji putni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'prip_putninalog', text: 'Priprema i odobreni', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'obr_izvoputu', text: 'Izvještaj o putu', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'priprema' },
        { id: 'pregled', text: 'Pregled putnih naloga', iconCss: 'em-icons-mod e-priprema', parentId: 'priprema' },        
        { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
        { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }, 
        { id: 'epotpis', text: 'Elektronski potpis', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'epotpis1', text: 'Priprema potpisa', iconCss: 'em-icons e-file', parentId: 'epotpis' },
        // { id: 'epotpis2', text: 'Pregled izdatih potpisa', iconCss: 'em-icons e-file', parentId: 'epotpis' },        
        // { id: 'epotpis2', text: 'Potpisivanje putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'epotpis' },
        // { id: 'epotpis3', text: 'Pregled svih potpisa', iconCss: 'em-icons-mod e-priprema', parentId: 'epotpis' },                
        { id: 'help_manual', text: 'Uputstvo', iconCss: 'em-icons-mod e-predlosci', parentId: null },           
        { id: 'help_dnrada', text: 'Dnevnik rada', iconCss: 'em-icons-mod e-predlosci', parentId: 'help_manual' },
        { id: 'help_mperun', text: 'Mobilna aplikacija mPerun', iconCss: 'em-icons-mod e-predlosci', parentId: 'help_manual' }                  
    ];

    public menuDataRuk: { [key: string]: Object| null }[] = [
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

    public menuDataPro: { [key: string]: Object| null }[] = [
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

    public menuDataSek: { [key: string]: Object | null}[] = [
        { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'prip_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'priprema' },
        // { id: 'prip_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'priprema' },   
        // { id: 'prip_putninalog_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'gp_priprema_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'priprema' },   
        { id: 'gp_priprema', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'gp_priprema_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'priprema' },           
        // { id: 'prip_putninalog_ext', text: 'Putni nalozi - eksterni', iconCss: 'em-icons e-file', parentId: 'priprema' },           
        // { id: 'otvoreni', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'otvoreni2', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },  
        { id: 'otvoreni_pn', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'ot_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },
        // { id: 'ot_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },
        // { id: 'ot_putninalog_proforma', text: 'Putni nalozi - PROFORMA', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },  
        { id: 'gp_otvoren_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },   
        { id: 'gp_otvoren', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },
        { id: 'gp_otvoren_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },           
        { id: 'storno_pn', text: 'Storno naloga', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'st_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'storno_pn' },   
        // { id: 'st_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'storno_pn' },           
        // { id: 'st_putninalog_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'storno_pn' },    
        { id: 'gp_storno_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'storno_pn' },   
        { id: 'gp_storno', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'storno_pn' },
        { id: 'gp_storno_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'storno_pn' },                            
        // { id: 'protokol', text: 'Protokol', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'ost_putninalog_org', text: 'Unos protokola', iconCss: 'em-icons e-file', parentId: 'protokol' }, 
        { id: 'protokoli', text: 'Knjiga protokola', iconCss: 'em-icons e-file', parentId: null },           
        { id: 'protokol_knjiga', text: 'Knjiga protokola BHRT', iconCss: 'em-icons e-file', parentId: 'protokoli' },         
        { id: 'protokol_knjiga-ext', text: 'Knjiga protokola RTVFBiH', iconCss: 'em-icons e-file', parentId: 'protokoli' },     
        { id: 'obracunati_pn', text: 'Obračunati nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'ob_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'obracunati_pn' },           
        { id: 'ob_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'obracunati_pn' },         
        // { id: 'izv_putninalog', text: 'Prilozi', iconCss: 'em-icons-mod e-predlosci', parentId: null },        
        // { id: 'izv_putninalog_org', text: 'Računi naloga za obračun', iconCss: 'em-icons-mod e-predlosci', parentId: 'izv_putninalog' },                             
        { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
        { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
        { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },              
        //{ id: 'prip_predlosci', text: 'Predlošci', iconCss: 'em-icons-mod e-predlosci', parentId: 'priprema' },
        // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
        // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
        // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
        { id: 'evidencije', text: 'Evidencije rada i odsustva', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'evid_kontrola', text: 'Kontrola dnevnika', iconCss: 'em-icons e-file', parentId: 'evidencije' }                        
    ];    

    public menuDataBla: { [key: string]: Object | null}[] = [
        { id: 'blagajna', text: 'Blagajna', iconCss: 'em-icons-mod e-odobravanje', parentId: null },
        // { id: 'ispl_akontacija', text: 'Akontacije za putni nalog', iconCss: 'em-icons-mod e-akontacija', parentId: 'blagajna' },
        // { id: 'ispl_pravdanje', text: 'Pravdanje putnog naloga', iconCss: 'em-icons-mod e-pravdanje', parentId: 'blagajna' },
        { id: 'gp_pravdanje', text: 'Pravdanje putnog naloga', iconCss: 'em-icons-mod e-pravdanje', parentId: 'blagajna' },        
        // { id: 'temeljnica', text: 'Temeljnica', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'ost_putninalog_org', text: 'Unos temeljnice', iconCss: 'em-icons e-file', parentId: 'temeljnica' },           
        // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
        // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
        // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
    ];

    // public menuDataLik: { [key: string]: Object }[] = [
    //     { id: 'priprema', text: 'Priprema-akontacije', iconCss: 'em-icons-mod e-priprema', parentId: null },
    //     { id: 'akon_putninalog', text: 'Putni nalozi', iconCss: 'em-icons e-file', parentId: 'priprema' },        
    //     { id: 'akon_putninalog_ext', text: 'Putni nalozi - eksterni', iconCss: 'em-icons e-file', parentId: 'priprema' },           
    //     { id: 'obracun', text: 'Obračun', iconCss: 'em-icons-mod e-obracun', parentId: null },
    //     // { id: 'obr_izvoputu', text: 'Izvještaj o putu', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'obracun' },
    //     { id: 'obr_kontrola', text: 'Dolazni nalozi za obračun', iconCss: 'em-icons-mod e-obracun', parentId: 'obracun' },        
    //     { id: 'obr_obracun', text: 'Tekući obračun naloga', iconCss: 'em-icons-mod e-obracun', parentId: 'obracun' },          
    //     { id: 'aktivnost', text: 'Aktivnosti', iconCss: 'em-icons-mod e-priprema', parentId: null },
    //     { id: 'edit_aktivnost', text: 'Unos aktivnosti', iconCss: 'em-icons e-file', parentId: 'aktivnost' },         
    //     { id: 'saradnici', text: 'Saradnici', iconCss: 'em-icons-mod e-priprema', parentId: null },
    //     { id: 'edit_saradnici', text: 'Unos saradnika', iconCss: 'em-icons e-file', parentId: 'saradnici' },          
    //     { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
    //     { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
    //     { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }         
        // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
        // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
        // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
    // ];

    public menuDataLik: { [key: string]: Object | null}[] = [
        { id: 'priprema', text: 'Priprema-akontacije', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'akon_putninalog', text: 'Putni nalozi', iconCss: 'em-icons e-file', parentId: 'priprema' },
        // { id: 'akon_putninalog_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'priprema' },                   
        { id: 'gp_akontacija', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'gp_akontacija_proforma', text: 'Putni nalozi - PRO FORMA', iconCss: 'em-icons e-file', parentId: 'priprema' },                                  
        // { id: 'akon_putninalog_ext', text: 'Putni nalozi - eksterni', iconCss: 'em-icons e-file', parentId: 'priprema' },  
        { id: 'otvoreni', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },                           
        // { id: 'otvoreni2', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },           
        { id: 'aktivnost', text: 'Ostali podaci', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'edit_person', text: 'Unos saradnika', iconCss: 'em-icons e-file', parentId: 'aktivnost' },        
        { id: 'edit_aktivnost', text: 'Unos aktivnosti', iconCss: 'em-icons e-file', parentId: 'aktivnost' },         
        // { id: 'saradnici', text: 'Saradnici', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'edit_saradnici', text: 'Unos saradnika', iconCss: 'em-icons e-file', parentId: 'saradnici' },  
        { id: 'obracun', text: 'Obračun', iconCss: 'em-icons-mod e-obracun', parentId: null },
        { id: 'obr_kontrola', text: 'Dolazni nalozi za obračun', iconCss: 'em-icons-mod e-obracun', parentId: 'obracun' },        
        { id: 'obr_obracun', text: 'Tekući obračun naloga', iconCss: 'em-icons-mod e-obracun', parentId: 'obracun' }, 
        { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
        { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
        { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },
        { id: 'rpt_pregled', text: 'Pregled naloga', iconCss: 'em-icons e-file', parentId: 'pregled' },                                   
    ];
    public menuDataLikExtpl: { [key: string]: Object | null}[] = [
        { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'akon_putninalog', text: 'Putni nalog', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },                              
        { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
        { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }         
        // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
        // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
        // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
    ];

    public menuDataDir: { [key: string]: Object | null}[] = [
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

    public menuDataUpr: { [key: string]: Object | null}[] = [
        // { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
        // { id: 'prip_putninalog', text: 'Putni nalog', iconCss: 'em-icons e-file', parentId: 'priprema' },
        // { id: 'prip_predlosci', text: 'Predlošci', iconCss: 'em-icons-mod e-predlosci', parentId: 'priprema' },
        { id: 'odobravanje', text: 'Potpisivanje', iconCss: 'em-icons-mod e-odobravanje', parentId: null },
        { id: 'odob_epotpis1', text: 'Otvoreni putni nalozi', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },
        { id: 'odob_epotpis2', text: 'Obračunati putni nalozi', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' }, 
        { id: 'odob_epotpis3', text: 'Odobravanje prevoza', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },        
        { id: 'epotpis2', text: 'Pregled izdatih potpisa', iconCss: 'em-icons e-file', parentId: 'odobravanje' },           
        { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
        { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
        { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }         
        // { id: 'izvjestaj', text: 'Izvještaj', iconCss: 'em-icons-mod e-izvjestaj', parentId: null },
        // { id: 'izv_putninalog', text: 'Putnih naloga', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' },
        // { id: 'izv_putninalogupo', text: 'Putnih naloga po uposleniku', iconCss: 'em-icons-mod e-izvjestaj', parentId: 'izvjestaj' }
    ];

    public menuDataUprFin: { [key: string]: Object | null}[] = [
        { id: 'odobravanje', text: 'Odobravanje', iconCss: 'em-icons-mod e-odobravanje', parentId: null },
        { id: 'obr_obracun', text: 'Obračuni', iconCss: 'em-icons-mod e-odobravanje', parentId: 'odobravanje' },
        { id: 'pregled', text: 'Pregled', iconCss: 'em-icons-mod e-priprema', parentId: null },        
        { id: 'prip_pregled', text: 'Pregled naloga za putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' },        
        { id: 'obr_pregled', text: 'Pregled naloga nakon putovanja', iconCss: 'em-icons-mod e-predlosci', parentId: 'pregled' }         
    ];
    
    
    public menuDataAdm: { [key: string]: Object | null}[] = [
        { id: 'adm_employees', text: 'Pristup portalu', iconCss: 'em-icons-mod e-zatvaranje', parentId: null }, 
        { id: 'adm_role', text: 'Role pristupa', iconCss: 'em-icons-mod e-zatvaranje', parentId: null },                         
        { id: 'adm_role1', text: 'Role pristupa portalu I', iconCss: 'em-icons-mod e-zatvaranje', parentId: 'adm_role' },             
        //{ id: 'adm_role2', text: 'Role pristupa portalu II', iconCss: 'em-icons-mod e-zatvaranje', parentId: 'adm_role' },                             
        { id: 'adm_orgrole', text: 'Organizacione role pristup portalu', iconCss: 'em-icons-mod e-zatvaranje', parentId: 'adm_role' },             
        { id: 'adm_epotpisi', text: 'E-potpisi', iconCss: 'em-icons-mod e-predlosci', parentId: null },            
        { id: 'admin', text: 'Ostale postavke', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'adm_protokol2', text: 'Postavka broja protokola', iconCss: 'em-icons-mod e-odobravanje', parentId: 'admin' },        
        { id: 'adm_parametri', text: 'Fiksni parametri', iconCss: 'em-icons e-file', parentId: 'admin' },
        { id: 'adm_protokol', text: 'Protokol', iconCss: 'em-icons-mod e-odobravanje', parentId: 'admin' },
        { id: 'adm_rbputnal', text: 'Knjiga naloga', iconCss: 'em-icons-mod e-zatvaranje', parentId: 'admin' },
        { id: 'emp', text: 'Uposlenici', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'emp_personalinfo', text: 'Personalne informacije', iconCss: 'em-icons e-file', parentId: 'emp' },      
        { id: 'emp_personalinfo2', text: 'Unos evidencija - postavke', iconCss: 'em-icons e-file', parentId: 'emp' },
        { id: 'emp_personalinfo3', text: 'Email slanje - zabrane', iconCss: 'em-icons e-file', parentId: 'emp' },
        { id: 'org', text: 'Organizacija', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'org_organizacija', text: 'Organizacija', iconCss: 'em-icons e-file', parentId: 'org' },                              
    ];

    public menuDataProExt: { [key: string]: Object | null}[] = [
        { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'prip_putninalog', text: 'Putni nalog', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'otvoreni', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null }                                   
    ];

    public menuDataSekExt: { [key: string]: Object | null}[] = [
        { id: 'priprema', text: 'Priprema', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'prip_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'priprema' },
        { id: 'prip_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'priprema' },   
        { id: 'otvoreni_pn', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'ot_putninalog_my', text: 'Putni nalozi - moja lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },
        { id: 'ot_putninalog_org', text: 'Putni nalozi - puna lista', iconCss: 'em-icons e-file', parentId: 'otvoreni_pn' },                                                    
        { id: 'protokol_knjiga', text: 'Knjiga protokola', iconCss: 'em-icons e-file', parentId: null }                                
    ];  

    public menuDataLikExt: { [key: string]: Object | null}[] = [
        { id: 'priprema', text: 'Priprema-akontacije', iconCss: 'em-icons-mod e-priprema', parentId: null },
        { id: 'akon_putninalog', text: 'Putni nalozi', iconCss: 'em-icons e-file', parentId: 'priprema' },        
        { id: 'otvoreni', text: 'Otvoreni nalozi', iconCss: 'em-icons-mod e-priprema', parentId: null },                                            
        { id: 'obracun', text: 'Obračun', iconCss: 'em-icons-mod e-obracun', parentId: null },
        { id: 'obr_kontrola', text: 'Dolazni nalozi za obračun', iconCss: 'em-icons-mod e-obracun', parentId: 'obracun' },        
        { id: 'obr_obracun', text: 'Tekući obračun naloga', iconCss: 'em-icons-mod e-obracun', parentId: 'obracun' },                  

    ];

    @Output() change: EventEmitter<any> = new EventEmitter();

      

    constructor(
        private router: Router,     
        private restDataSource: RestDataSource,       
        private usersession: UserSessionService,
        private loaderService: LoaderService    
        ) {
        this.userLoggedIn.next(this.menuDataDef);
    }


    setMenu(){
        switch(this.usersession.role) { 
            case 'uposlenik': { 
                //console.log("menu.service 1: " + JSON.stringify(this.menuDataLogged))
                this.menuDataLogged = [];
                for (var el of this.menuDataUpo) {
                    this.menuDataLogged.push(el);
               }
                //console.log("menu.service 2: " + JSON.stringify(this.menuDataLogged))                           
                this.setMenuBySubRole();  
               break; 
            }  
            case 'rukovodilac': { 
                this.menuDataLogged = this.menuDataRuk;
               break; 
            }             
            case 'producent': { 
                this.menuDataLogged = this.menuDataPro;
               break; 
            }  
            case 'sekretarica': { 
                this.menuDataLogged = this.menuDataSek;
               break; 
            }              
            case 'blagajna': { 
                this.menuDataLogged = this.menuDataBla;
               break; 
            }  
            case 'likvidatura': { 
                this.menuDataLogged = this.menuDataLik;
               break; 
            }  
            case 'likvidatura-ext': { 
                this.menuDataLogged = this.menuDataLikExtpl;
               break; 
            } 
            case 'direkcija': { 
                this.menuDataLogged = this.menuDataDir;
               break; 
            }                         
            case 'uprava': { 
                this.menuDataLogged = this.menuDataUpr;
               break; 
            }
            case 'upravafin': { 
                this.menuDataLogged = this.menuDataUprFin;
               break; 
            }            
            case 'administrator': { 
                this.menuDataLogged = this.menuDataAdm;
               break; 
            }  
            case 'ext-producent': { 
                this.menuDataLogged = this.menuDataProExt;
               break; 
            }  
            case 'ext-sekretarica': { 
                this.menuDataLogged = this.menuDataSekExt;
               break; 
            }               
            case 'ext-likvidatura': { 
                this.menuDataLogged = this.menuDataLikExt;
               break; 
            }                                                                         
            default: { 
                this.menuDataLogged = this.menuDataDef;
               break; 
               break; 
            } 
         }         
    }

    setMenuBySubRole(){
        switch(this.usersession.subrole) { 
            case 'evidencije': { 

                this.menuDataLogged.push({ id: 'evid_calendar', text: 'Kalendar rada i odsustva', iconCss: 'em-icons e-file', parentId: 'evidencije' });                
                let _removeItem: string = 'evid_dnevnik';
                _removeItem = 'priprema';   
                //console.log("menu.service 3: " + JSON.stringify(this.menuDataLogged))                             
                // for (let i = 0; i < this.menuDataUpo.length; i++) {
                //     if (this.menuDataUpo[i].id ===  _removeItem) {
                //         this.menuDataUpo.splice(i--, 1);
                //     }
                //   }                
               break; 
            }                                                           
            default: { 

               break; 
            } 
         }         
    }

    setUserLoggedIn() {
        this.setMenu();
        this.userLoggedIn.next(this.menuDataLogged);
      }
    
    getUserLoggedIn(): Observable<{ [key: string]: Object  | null}[]> {
          return this.userLoggedIn.asObservable();
      }    

    public selectDef(linkId: string) {
          switch (linkId) {
              default: {
                  this.router.navigate(['/login']);
                  break;
              }
          }
      }

    public selectUpo(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog': { 
                this.router.navigate(['/pro_priprema', this.usersession.apiDays, 'priprema,akontacija,otvoren,odobren,aktivan']);
               break; 
            }  
            case 'prip_predlosci': { 
                this.router.navigate(['/upo_aktivni','byemp']);
               break; 
            }   
            case 'obr_izvoputu': { 
                this.router.navigate(['/obr_izvoputu', this.usersession.apiDays, 'aktivan,popunautoku,popunjen']);
               break; 
            }   
            case 'prip_pregled': { 
                this.route_prip_pregled('byupo');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byupo');
               break; 
            }       
            case 'evid_dnevnik': { 
                this.router.navigate(['/evid_dnevnik']);
               break; 
            } 
            case 'evid_dnevnik2': { 
                //this.router.navigate(['/evid_dnevnik2']);
                this.router.navigate(['/home-not-developed/Dnevnik rada i odsustva']);
               break; 
            }                  
            case 'evid_calendar': { 
                //this.router.navigate(['/evid_calendar']);
                this.router.navigate(['/home-not-developed/Kalendar rada i odsustva']);
               break; 
            }                 
            case 'help_dnrada': { 
                let pdffilename : string = "Perun-Dnevnik rada i odsustva.pdf";
                this.router.navigateByUrl('/pdfviewer/' + pdffilename);
               break; 
            }      
            case 'help_mperun': { 
                let pdffilename : string = "mPerunHelp.pdf";
                this.router.navigateByUrl('/pdfviewer/' + pdffilename);
               break; 
            }   
            case 'epotpis1': {                 
                // this.loaderService.display(true);                
                this.router.navigate(['/epotpis1']);
               break; 
            }   
            case 'epotpis2': {                 
                // this.loaderService.display(true);                
                this.router.navigate(['/epotpis2']);
               break; 
            }                                                                                       
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectRuk(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog': { 
                this.router.navigate(['/pro_priprema', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_predlosci': { 
                this.router.navigate(['/upo_priprema','bypg']);
               break; 
            }   
            case 'odob_epotpis1': { 
                this.router.navigate(['/potpis1', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            } 
            case 'odob_epotpis2': { 
                this.router.navigate(['/potpis2', this.usersession.apiDays, 'obracunfin,obracunat']);
               break; 
            }               
            case 'odob_key': { 
                this.router.navigate(['/key']);
               break; 
            }              
            case 'obr_izvoputu': { 
                this.router.navigate(['/obr_izvoputu', this.usersession.apiDays, 'aktivan,popunautoku,popunjen']);
               break; 
            }        
            case 'obr_provjera': { 
                //this.router.navigate(['/obr_provjera', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow(linkId, 'rukovodilac')]);
               break; 
            }  
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            } 
            case 'epotpis2': {                 
                // this.loaderService.display(true);                
                this.router.navigate(['/epotpis2']);
               break; 
            }                                                                  
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectPro(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/pro_priprema_my', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_priprema_org', 'byorgpg', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            } 
            case 'prip_putninalog_proforma': { 
                this.loaderService.display(true);                
                this.router.navigate(['/pro_priprema_proforma', this.usersession.apiDays, 'pripremaPF,akontacijaPF']);
               break; 
            }                
            case 'prip_putninalog_ext': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/pro_priprema_ext', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            } 
            case 'otvoreni': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }   
            case 'otvoreni2': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni2', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }   
            case 'ot_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/pro_otvoreni_my', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }  
            case 'ot_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_otvoreni_org', 'byorgpg', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }     
            case 'ot_putninalog_proforma': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_otvoreni_proforma', 'byorgpg', this.usersession.apiDays, 'otvorenPF,odobrenPF']);
               break; 
            }   
            case 'gp_priprema_my': { 
                this.router.navigate(['/gp_priprema_my']);                
               break; 
            }              
            case 'gp_priprema': { 
                this.router.navigate(['/gp_priprema']);                
               break; 
            }             
            case 'gp_priprema_proforma': { 
                this.router.navigate(['/gp_priprema_proforma']);                
               break; 
            }              
            case 'gp_otvoren_my': { 
                this.router.navigate(['/gp_otvoren_my']);                
               break; 
            }              
            case 'gp_otvoren': { 
                this.router.navigate(['/gp_otvoren']);                
               break; 
            }             
            case 'gp_otvoren_proforma': { 
                this.router.navigate(['/gp_otvoren_proforma']);                
               break; 
            }  
            case 'gp_storno_my': { 
                this.router.navigate(['/gp_storno_my']);                
               break; 
            }              
            case 'gp_storno': { 
                this.router.navigate(['/gp_storno']);                
               break; 
            }             
            case 'gp_storno_proforma': { 
                this.router.navigate(['/gp_storno_proforma']);                
               break; 
            }   
            case 'st_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/sto_otvoreni_my', this.usersession.apiDays, 'odobren,storno']);
               break; 
            }  
            case 'st_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/sto_otvoreni_org', 'byorgpg', this.usersession.apiDays, 'odobren,storno']);
               break; 
            }     
            case 'st_putninalog_proforma': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/sto_otvoreni_proforma', 'byorgpg', this.usersession.apiDays, 'odobrenPF,storno']);
               break; 
            }                                                        
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            // case 'otvoreni': { 
            //     this.loaderService.display(true);                 
            //     this.router.navigate(['/otvoreni', this.usersession.apiDays, 'otvoren,odobren']);
            //    break; 
            // }             
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }          
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectSek(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/pro_priprema_my', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_priprema_org', 'byorgpg', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            } 
            case 'prip_putninalog_proforma': { 
                this.loaderService.display(true);                
                this.router.navigate(['/pro_priprema_proforma', this.usersession.apiDays, 'pripremaPF,akontacijaPF']);
               break; 
            }                
            case 'prip_putninalog_ext': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/pro_priprema_ext', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            } 
            case 'otvoreni': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }   
            case 'otvoreni2': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni2', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }   
            case 'ot_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/pro_otvoreni_my', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }  
            case 'ot_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_otvoreni_org', 'byorgpg', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }     
            case 'ot_putninalog_proforma': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_otvoreni_proforma', 'byorgpg', this.usersession.apiDays, 'otvorenPF,odobrenPF']);
               break; 
            }   
            case 'gp_priprema_my': { 
                this.router.navigate(['/gp_priprema_my']);                
               break; 
            }              
            case 'gp_priprema': { 
                this.router.navigate(['/gp_priprema']);                
               break; 
            }             
            case 'gp_priprema_proforma': { 
                this.router.navigate(['/gp_priprema_proforma']);                
               break; 
            }              
            case 'gp_otvoren_my': { 
                this.router.navigate(['/gp_otvoren_my']);                
               break; 
            }              
            case 'gp_otvoren': { 
                this.router.navigate(['/gp_otvoren']);                
               break; 
            }             
            case 'gp_otvoren_proforma': { 
                this.router.navigate(['/gp_otvoren_proforma']);                
               break; 
            }  
            case 'gp_storno_my': { 
                this.router.navigate(['/gp_storno_my']);                
               break; 
            }              
            case 'gp_storno': { 
                this.router.navigate(['/gp_storno']);                
               break; 
            }             
            case 'gp_storno_proforma': { 
                this.router.navigate(['/gp_storno_proforma']);                
               break; 
            }                          
            case 'st_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/sto_otvoreni_my', this.usersession.apiDays, 'odobren,storno']);
               break; 
            }  
            case 'st_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/sto_otvoreni_org', 'byorgpg', this.usersession.apiDays, 'odobren,storno']);
               break; 
            }     
            case 'st_putninalog_proforma': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/sto_otvoreni_proforma', 'byorgpg', this.usersession.apiDays, 'odobrenPF,storno']);
               break; 
            }                        
            case 'ob_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['obr_pregledfin', 'byorgpg', this.usersession.apiDays, 'obracunfin']);
               break; 
            }  
            case 'ob_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/obr_pregledfin_org', 'byorgpg', this.usersession.apiDays, 'obracunfin']);
               break; 
            }                       
            case 'protokol_knjiga': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/protokol_knjiga']);
               break; 
            }        
            case 'protokol_knjiga-ext': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/protokol_knjiga-10']);
               break; 
            }                                                                    
            case 'ost_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/ost_putninalog_org', 'byorgpg', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }
            case 'izv_putninalog_org': {
                this.loaderService.display(true);                  
                this.usersession.apiList = -1;
                this.router.navigate(['/izv_putninalog_org', 'byorgpg', this.usersession.apiDays, 'aktivan,popunautoku']);
               break; 
            }                          
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }   
            case 'evid_dnevnik': { 
                this.router.navigate(['/evid_dnevnik']);
               break; 
            }        
            case 'evid_kontrola': { 
                this.router.navigate(['/evid_kontrola']);
               break; 
            }                                             
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectBla(linkId: string){
        switch(linkId) { 
            case 'ispl_akontacija': { 
                this.router.navigate(['/ispl_akontacija', this.usersession.apiDays, 'odobren,aktivan']);
               break; 
            }  
            case 'ispl_pravdanje': { 
                this.router.navigate(['/ispl_pravdanje', this.usersession.apiDays, 'obracunfin,obracunat,opravdan']);
               break; 
            }    
            case 'gp_pravdanje': { 
                this.router.navigate(['/gp_pravdanje']);
               break; 
            }             
            case 'ost_putninalog_org': { 
                this.usersession.apiList = -1;
                this.router.navigate(['/ost_putninalog_org', 'byorgpg', this.usersession.apiDays, 'odobren, aktivan, obracunat, opravdan']);
               break; 
            }                       
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectLik(linkId: string){
        switch(linkId) { 
            case 'akon_putninalog': { 
                this.loaderService.display(true);                   
                // this.router.navigate(['/pro_akontacija', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow('pro_akontacija')]);
                this.router.navigate(['/pro_akontacija', this.usersession.apiDays, "akontacija,prevoz,otvoren"]);                
               break; 
            }   
            case 'akon_putninalog_ext': { 
                this.loaderService.display(true);                 
                //this.router.navigate(['/pro_akontacija_ext', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow('pro_akontacija_ext')]);
               break; 
            }   
            case 'akon_putninalog_proforma': { 
                this.loaderService.display(true);                
                //this.router.navigate(['/pro_priprema_proforma', this.usersession.apiDays, 'akontacijaPF,otvorenPF']);
                this.router.navigate(['/pro_akontacija_proforma', this.usersession.apiDays, 'akontacijaPF,otvorenPF']);                
               break; 
            } 
            case 'gp_akontacija': { 
                this.router.navigate(['/gp_akontacija']);                
               break; 
            }             
            case 'gp_akontacija_proforma': { 
                this.router.navigate(['/gp_akontacija_proforma']);                
               break; 
            }                                      
            case 'otvoreni': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }    
            case 'otvoreni2': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni2', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }                       
            case 'obr_kontrola': { 
                // this.loaderService.display(true);                 
                //this.router.navigate(['/obr_kontrola', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow('obr_kontrola')]);
               break; 
            }                                
            case 'obr_obracun': { 
                this.loaderService.display(true);                 
                //this.router.navigate(['/obr_obracun', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow('obr_obracun', this.usersession.role)]);
               break; 
            }              
            case 'obr_zatvaranje': { 
                this.router.navigate(['/putnalitem']);
               break; 
            }             
            case 'edit_aktivnost': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/edit_aktivnost']);
               break; 
            }    
            case 'edit_saradnici': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/edit_saradnici']);
               break; 
            }      
            case 'edit_person': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/edit_person']);
               break; 
            }                                            
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }    
            case 'rpt_pregled': {                              
                this.router.navigate(['/rpt_pregled']);
               break; 
            }                                                
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectLikExtpl(linkId: string){
        switch(linkId) { 
            case 'akon_putninalog': { 
                this.router.navigate(['/pro_akontacija_extpl', this.usersession.apiDays, 'akontacija,otvoren']);
               break; 
            }                                                     
            case 'prip_pregled': { 
                this.route_prip_pregled_extpl('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled_extpl('byorgpg');
               break; 
            }                                       
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectDir(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog': { 
                this.router.navigate(['/pro_priprema', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_predlosci': { 
                this.router.navigate(['/upo_aktivni','byemp']);
               break; 
            } 
            case 'odob_epotpis1': { 
                this.router.navigate(['/potpis1', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            } 
            case 'odob_epotpis2': { 
                this.router.navigate(['/potpis2', this.usersession.apiDays, 'obracunfin,obracunat']);
               break; 
            }     
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }  
            case 'epotpis2': {                 
                // this.loaderService.display(true);                
                this.router.navigate(['/epotpis2']);
               break; 
            }                                               
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectUpr(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog': { 
                this.router.navigate(['/pro_priprema', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_predlosci': { 
                this.router.navigate(['/upo_aktivni','byemp']);
               break; 
            } 
            case 'odob_epotpis1': { 
                this.router.navigate(['/potpis1', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            } 
            case 'odob_epotpis2': { 
                this.router.navigate(['/potpis2', this.usersession.apiDays, 'obracunfin,obracunat']);
               break; 
            } 
            case 'odob_epotpis3': { 
                this.router.navigate(['/potpis3', this.usersession.apiDays, 'prevoz,otvoren']);
               break; 
            }                   
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }  
            case 'epotpis2': {                 
                // this.loaderService.display(true);                
                this.router.navigate(['/epotpis2']);
               break; 
            }                                               
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectUprFin(linkId: string){
        switch(linkId) { 
            case 'obr_obracun': { 
                this.router.navigate(['/obr_obracun', this.usersession.apiDays, 'obracunutoku,obracunat']);
               break; 
            }   
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }                                    
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectAdm(linkId: string){
        switch(linkId) { 
            case 'adm_employees': { 
                this.router.navigate(['/adm_employees']);            
               break; 
            }
            case 'adm_orgrole': { 
                this.router.navigate(['/adm_orgrole']);            
               break; 
            }        
            case 'adm_role1': { 
                this.router.navigate(['/adm_role1']);            
               break; 
            }  
            case 'adm_role2': { 
                this.router.navigate(['/adm_role2']);            
               break; 
            }                                           
            case 'adm_epotpisi': { 
                this.router.navigate(['/adm_epotpisi']);  
               break; 
            }              
            case 'adm_parametri': { 
                this.router.navigate(['/adm_parametri']);  
               break; 
            }  
            case 'adm_protokol': { 
                // console.log("selectAdm: ",linkId);
                this.router.navigate(['/adm_protokol']);                
               break; 
            }  
            case 'adm_protokol2': { 
                // console.log("selectAdm: ",linkId);
                this.router.navigate(['/adm_protokol2']);                
               break; 
            }                
            case 'adm_rbputnal': { 
                this.router.navigate(['/adm_rbputnal']);
               break;
            } 
            case 'emp_personalinfo': { 
                this.router.navigate(['/emp_personalinfo']);            
               break; 
            }  
            case 'emp_personalinfo2': { 
                this.router.navigate(['/emp_personalinfo2']);            
               break; 
            }  
            case 'emp_personalinfo3': { 
                this.router.navigate(['/emp_personalinfo3']);            
               break; 
            } 
            case 'org_organizacija': { 
                this.router.navigate(['/org_organizacija']);            
               break; 
            }                                                                                               
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectProExt(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog': { 
                // this.loaderService.display(true);                
                // this.router.navigate(['/pro_priprema-ext', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_putninalog_ext': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/pro_priprema_ext', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }              
            case 'prip_predlosci': { 
                this.router.navigate(['/pro_priprema','byuser']);
               break; 
            }                         
            case 'prip_pregled': { 
                this.route_prip_pregled('byorgpg');
               break; 
            }  
            case 'otvoreni': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }             
            case 'obr_pregled': { 
                this.route_obr_pregled('byorgpg');
               break; 
            }          
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectSekExt(linkId: string){
        switch(linkId) { 
            case 'prip_putninalog_my': { 
                // this.loaderService.display(true);                 
                // this.usersession.apiList = this.usersession.empId;
                // this.router.navigate(['/pro_priprema-ext', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }  
            case 'prip_putninalog_org': { 
                // this.loaderService.display(true);                 
                // this.usersession.apiList = -1;
                // this.router.navigate(['/pro_priprema_org-ext', 'byorgpg', this.usersession.apiDays, 'priprema,akontacija']);
               break; 
            }   
            case 'ot_putninalog_my': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = this.usersession.empId;
                this.router.navigate(['/pro_otvoreni-ext', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }  
            case 'ot_putninalog_org': { 
                this.loaderService.display(true);                 
                this.usersession.apiList = -1;
                this.router.navigate(['/pro_otvoreni_org-ext', 'byorgpg', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }               
            case 'protokol_knjiga': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/protokol_knjiga']);
               break; 
            }                                                                                                                              
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    public selectLikExt(linkId: string){
        switch(linkId) { 
            case 'akon_putninalog': { 
                this.loaderService.display(true);                   
                this.router.navigate(['/pro_akontacija-ext', this.usersession.apiDays, "akontacija,prevoz,otvoren"]);                
               break; 
            }      
            case 'otvoreni': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni-ext', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }    
            case 'otvoreni2': { 
                this.loaderService.display(true);                 
                this.router.navigate(['/otvoreni2-ext', this.usersession.apiDays, 'otvoren,odobren']);
               break; 
            }                       
            case 'obr_kontrola': { 
                // this.loaderService.display(true);                 
                //this.router.navigate(['/obr_kontrola', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow('obr_kontrola')]);
               break; 
            }                                
            case 'obr_obracun': { 
                this.loaderService.display(true);                 
                //this.router.navigate(['/obr_obracun', this.usersession.apiDays, this.sptableapi.getPNUrlStatus_ByFlow('obr_obracun', this.usersession.role)]);
               break; 
            }                                                                                               
            default: { 
               //statements; 
               break; 
            } 
         } 
    }

    private route_prip_pregled(_bylist: string) {
        this.router.navigate(['/pro_pregledput', _bylist, this.usersession.apiDays, 'priprema,akontacija,otvoren,odobren,aktivan']);
    }

    private route_obr_pregled(_bylist: string) {
        this.router.navigate(['/obr_pregledput', _bylist, this.usersession.apiDays, 'popunautoku,popunjen,provjeren,obracunutoku,obracunfin,obracunat,opravdan']);
    }

    private route_prip_pregled_extpl(_bylist: string) {
        this.router.navigate(['/pro_pregledput_extpl', _bylist, this.usersession.apiDays, 'priprema,akontacija,otvoren,odobren,aktivan']);
    }

    private route_obr_pregled_extpl(_bylist: string) {
        this.router.navigate(['/obr_pregledput_extpl', _bylist, this.usersession.apiDays, 'popunautoku,popunjen,provjeren,obracunutoku,obracunat,opravdan']);
    }      
}