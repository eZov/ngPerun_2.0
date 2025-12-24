import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
    PageSettingsModel, EditSettingsModel, ToolbarItems,
    GridComponent, Column, SaveEventArgs, EditEventArgs, DataSourceChangedEventArgs,
    IRow, CommandModel, IEditCell
} from '@syncfusion/ej2-angular-grids';
import { SidebarComponent, TreeViewComponent, NodeKeyPressEventArgs, NodeClickEventArgs } from '@syncfusion/ej2-angular-navigations';


import { LoaderService } from '../../core-services/loader.service';
import { AdmEmployee } from '../../model/adm-employees.model';
import { closest } from '@syncfusion/ej2-base';
import { UserEmployeeService } from '../services/user-employee.service';
import { OrgjedService } from '../services/orgjed.service';
import { EmployeesService } from '../services/employees.service';
import { OrgJed } from '../../model/orgjed.model';
import { OrgJedListService } from '../services/orgjed-list.service';


@Component({
    selector: 'nga-adm-users',
    templateUrl: './adm-users-orgroles.component.html',
    styleUrls: ['./adm-users-orgroles.component.css']
})
export class AdmUsersOrgRolesComponent implements OnInit {
    private subs: Subscription[] = [];

    // GRID settings ...START ****************************************************
    @ViewChild('grid', { static: false }) grid!: GridComponent;
    public pageSettings!: PageSettingsModel;
    public editSettings!: EditSettingsModel;
    public commands!: CommandModel[];
    public toolbar!: ToolbarItems[];

    public customAttributes!: Object;

    public boolParams!: IEditCell;
    // GRID settings ...END ****************************************************

    @ViewChild('treeroot', { static: false }) treeview!: TreeViewComponent;
    public orgjed!: OrgJed[]
    public field: Object = { dataSource: [], id: 'Id', parentID: 'ParentId', text: 'Naziv', hasChildren: 'HasChild' };
    public showCheckBox: boolean = false;
    public autoCheck: boolean = true;

    showLoader!: boolean;

    @ViewChildren('treegrid') treeViews!: QueryList<TreeViewComponent>;

    // Čuvanje TreeView instanci po EmployeeID
    treeViewInstances: { [key: number]: TreeViewComponent } = {};

    public showCheckBox1: boolean = true;
    public autoCheck1: boolean = true;

    constructor(
        private loaderService: LoaderService,
        private orgjedService: OrgjedService,
        private orgjedListService: OrgJedListService,
        private employeesService: EmployeesService,
        private route: ActivatedRoute,
        private userEmployeeService: UserEmployeeService
    ) {
    }



    ngOnInit() {
        // GRID settings ...START ****************************************************
        this.editSettings = {
            showConfirmDialog: true, showDeleteConfirmDialog: true,
            allowEditing: true, allowAdding: false, allowDeleting: false, mode: 'Batch'
        };
        this.toolbar = ['Update', 'Cancel', 'Search'];
        this.commands = [{ buttonOption: { content: 'Reset', cssClass: 'e-flat', click: this.onClick.bind(this) } }];

        this.boolParams = { params: { checked: true } };
        // GRID settings ...END ****************************************************


        const sub1 = this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });
        this.subs.push(sub1);

        this.orgjed = this.route.snapshot.data['orgList'].map((one: any) => {
            if (one.ParentId == 0) { one.ParentId = null; }
            return one;
        }
        );
        this.field = { ...this.field, dataSource: this.orgjed };

        const sub2 = this.orgjedListService.data.subscribe(result => {
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
        this.subs.push(sub2);

        const sub3 = this.employeesService.data.subscribe(result => {

            console.log('employees-data - ngOnInit - dataService.data.subscribe - result: ', result);
            this.grid.dataSource = result;
            //   this.dataEmployees = result;
            //   this.data = result.map((item: any) => {
            //     return { EmployeeID: item.EmployeeID, Name: (item.FirstName + " " + item.LastName) };
            //   }
            //   );

        });
        this.subs.push(sub3);

        this.customAttributes = { class: 'customcss' };


        this.loaderService.display(false);
    }




    //HACK: Nakom UPDATE
    beforeBatchSave(args: any) {

        this.loaderService.display(true);
        console.log("beforeBatchSave-changed:" + JSON.stringify(args.batchChanges.changedRecords));

        let _admemployeeData: AdmEmployee[] = new Array<AdmEmployee>();

        //HACK for..of vraca vrijednosti objekta
        for (let _oneRec of args.batchChanges.changedRecords) {

            let _admEmployee: AdmEmployee = _oneRec as AdmEmployee;
            if (_admEmployee.Email && _admEmployee.Email.length > 5) {
                _admemployeeData.push(_admEmployee);
            }

            console.log("beforeBatchSave-loop:" + JSON.stringify(_admemployeeData));
        }

        this.userEmployeeService.processWebAccess(_admemployeeData).subscribe({
            next: (result) => {
                console.log("processWebAccess:" + JSON.stringify(result));
                this.loaderService.display(false);
            },
            error: (err) => {
                console.log(err);
                this.loaderService.display(false);
            }
        });


    }



    show() {
        this.grid.columnChooserModule.openColumnChooser(200, 50); // give X and Y axis
    }

    onClick(args: Event): void {
        let rowObj: IRow<Column> = this.grid.getRowObjectFromUID(closest(<Element>args.target, '.e-row').getAttribute('data-uid') || '');
        let data: { Email: string, [key: string]: any } | undefined = rowObj.data as { Email: string, [key: string]: any };
        if (!data) {
            console.error('Row data is undefined');
            return;
        }

        this.loaderService.display(true);

        this.userEmployeeService.resetpassword(data["Email"])
            .subscribe({
                next: (result) => {
                    this.loaderService.display(false);
                    console.log(JSON.stringify(result["token"]));
                    //alert("Lozinka je uspješno resetovana:" + result["token"]);
                },
                error: (err) => {
                    console.log(err);
                    this.loaderService.display(false);
                }
            })

    }

    private expandAll() {
        let targetNodeId: string = this.orgjedService.getSelOrgjed();
        let nodes: string[] = this.orgjedService.getSelOrgjedPath();

        console.log('adm-organizacija.expandAll uslov:' + JSON.stringify(nodes));
        this.treeview.expandAll(nodes);
        this.treeview.selectedNodes = [targetNodeId];
    }

    public onDataBound(args: any) {
        console.log("onDataBound:" + args.node);
        this.expandAll();
    }

    public onNodeSelected(args: any) {

        //this.employeesService.getData(args.nodeData.id);
        this.userEmployeeService.listUserEmployeeBySifra(args.nodeData.id).subscribe({
            next: (result) => {
                this.grid.dataSource = result;
            },
            error: (err) => { console.log(err); }
        });

        console.log("selected node:" + args.nodeData.id);
    }

    public onNodeClicked(args: any) {
        console.log("clicked node:" + args.node.id);
    }

    public onCreated(args: any) {
        // this.treeview.expandAll();
        console.log("created node :" + JSON.stringify(args));
        console.log("TreeView instance:", this.treeview);

    }

    // //////////////////////////////////////////////////////////////////////////////////////////////////
    // Grid template: treeview
    // //////////////////////////////////////////////////////////////////////////////////////////////////
    public onDataBound1(args: any) {
        console.log("onDataBound1:" + args.node);
        this.expandAll();
    }

    public onNodeSelected1(args: any) {

        console.log("onNodeSelected1 node:" + args.nodeData.id);
    }

    public onNodeClicked1(args: any, empId: number) {
        console.log("onNodeClicked1 1:" + args.node.id);
        console.log("onNodeClicked1 2:" + empId);
    }

    public onCreated1(args: any, empId: number) {
        // this.treeview.expandAll();
        console.log("created node 1:" + JSON.stringify(args));

        console.log("created node 2:", this.treeViews);
        // Ovo će se pozvati za svaki TreeView
        const treeView = this.treeViews.last;
        this.treeViewInstances[empId] = treeView;

        // Prikaži postojeće organizacione role uposlenika
        treeView.uncheckAll();
        treeView.checkAll(this.convCsvToArr("1020101,10204,1020401"));

    }



    public onNodeChecked1(args: any, empId: number) {
        console.log("onNodeChecked 1:" + args.action);
        console.log("onNodeChecked 2:" + JSON.stringify(args.data));

        console.log("onNodeChecked 3:" + empId);

        console.log("onNodeChecked 4:" + JSON.stringify(this.treeViewInstances[empId].getAllCheckedNodes()));

        const treeView = this.treeViewInstances[empId];
        let _chkNodes: string[] = treeView.getAllCheckedNodes();
        console.log("onNodeChecked 5:" + _chkNodes);

        let _csvStr: string = _chkNodes.join(",");
        console.log("onNodeChecked 6:" + _csvStr);

        Object.entries(this.treeViewInstances).forEach(([key, value]) => {
            console.log(`Key: ${key}, Value:`, value.getAllCheckedNodes());
        });


        // Object.values(this.treeViewInstances).forEach((treeInst, idx) => {
        //     console.log("onNodeChecked 7:" + JSON.stringify(treeInst.getAllCheckedNodes()));
        //     console.log("onNodeChecked 8:" + idx);
        // });

    }


    convCsvToArr = (_csvStr: string): string[] => {
        let _arrOrgID: string[] = _csvStr.split(",");
        let _arrOrgIDSorted: string[] = _arrOrgID.sort();

        return _arrOrgIDSorted;
    };


    ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
        console.log('adm-users -ngOnDestroy...');
    }
}
