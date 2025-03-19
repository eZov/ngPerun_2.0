import { NgModule, Component, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations'

import { LoaderService } from '../../core-services/loader.service';
import { RestDataSource } from '../../shared/rest.datasource';
import { OrgJed } from '../../model/orgjed.model';

import { OrgjedService } from '../services/orgjed.service';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
    selector: 'app-adm-organizacija',
    templateUrl: './adm-organizacija.component.html',
    styleUrls: ['./adm-organizacija.component.css']
})
export class AdmOrganizacijaComponent {
    private subs: Subscription[] = [];

    @ViewChild('treevalidate', { static: false }) treeview!: TreeViewComponent;

    isLoading = true;
    showLoader!: boolean;

    public orgjed!: OrgJed[]
    public field: Object = { dataSource: [], id: 'Id', parentID: 'ParentId', text: 'Naziv', hasChildren: 'HasChild' };
    public showCheckBox: boolean = false;
    public autoCheck: boolean = true;

    constructor(
        private loaderService: LoaderService,
        public messageService: MessageService,
        private route: ActivatedRoute,
        public restDataSource: RestDataSource,
        private orgjedService: OrgjedService,
        private dataService: DataService
    ) {
        console.log("adm-organizacija.construct:" + JSON.stringify(route.url));
    }

    ngOnInit() {

        this.orgjed = this.route.snapshot.data['orgList'].map((one: any) => {
            if (one.ParentId == 0) { one.ParentId = null; }
            return one;
        }
        );
        this.field = { ...this.field, dataSource: this.orgjed };

        const sub1 = this.dataService.data.subscribe(result => {
            this.orgjed = result.map((one: any) => {
                if (one.ParentId == 0) { one.ParentId = null; }
                return one;
            }
            );
            // doznačavanje podataka u field.dataSource trigeruje event: onDataBound
            // u handleru onDataBound se poziva expandAll
            this.field = { ...this.field, dataSource: this.orgjed };
            console.log('adm-organizacija.OnInit getData');

        });
        this.subs.push(sub1);

    }

    private expandAll() {
        let targetNodeId: string = this.orgjedService.getSelOrgjed();
        let nodes: string[] = this.orgjedService.getSelOrgjedPath();

        console.log('adm-organizacija.expandAll uslov:' + JSON.stringify(nodes));
        this.treeview.expandAll(nodes);
        this.treeview.selectedNodes = [targetNodeId];
    }

    public onCreated(args: any) {
        // this.treeview.expandAll();
    }

    public onNodeClicked(args: any) {
        console.log("clicked node:" + args.node);
    }

    public onNodeSelected(args: any) {

        this.orgjed.forEach(one => {
            if (one.Id == Number(args.nodeData.id)) {
                console.log("OrgJed:" + JSON.stringify(one));
                this.orgjedService.setOrgjed(one);
            }
        });
    }

    public onDataBound(args: any) {
        console.log("onDataBound:" + args.node);
        this.expandAll();
    }

    public getOrgList() {
        let _chkNodes: string[] = this.treeview.getAllCheckedNodes();
        console.log("checked nodes:" + _chkNodes);

        this.loaderService.display(true);
    }

    parentMethod(): void {
        this.messageService.reportMessage(new Message(`Method in parent was called...`, false, true));
        this.expandAll();
    }

    ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
        console.log('adm-organizacija -ngOnDestroy...');
    }
}