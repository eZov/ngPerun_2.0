
export class User {
    UserRoles: string[];
    currentRole: string;
    role: string;
    email: string;
    subRole: string;
    workStation: string;
    nameid: string;
    empId: number;

    constructor(
        UserRoles: string[] = [],
        currentRole: string = '',
        role: string = '',
        email: string = '',
        SubRole: string = '',
        WorkStation: string = '',
        nameid: string = '',
        empId: number = -1
    ) {
        this.UserRoles = UserRoles;
        this.currentRole = currentRole;
        this.role = role;
        this.email = email;
        this.subRole = SubRole;
        this.workStation = WorkStation;
        this.nameid = nameid;
        this.empId = empId;        
    }
}