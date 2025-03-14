import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { Employee } from "../model/employee.model";
import { Resolve } from "@angular/router";
import { shareReplay } from "rxjs/operators";

@Injectable()
export class EmployeeService implements Resolve<any> {
  private _employees!: Employee[];

  private employeesModel: Employee[] = new Array<Employee>();
  private employeesRequest!: Observable<Employee[]>;

  constructor(private restDataSource: RestDataSource) {
    this.restDataSource.getEmployees().subscribe(
      (_employees: Employee[]) => {
        this._employees = _employees;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resolve(): Observable<any> {
    return this.restDataSource.getEmployees();
  }

  getEmployees(): Observable<Employee[]> {
    return this.employeesRequest;
  }
}
