
export class User {
    UserRoles?: string[];
    currentRole?: string;
    role?: string;
    email?: string;
    SubRole?: string;
    WorkStation?: string;
    nameid?: string;

    constructor(
        UserRoles?: string[],
        currentRole?: string,
        role?: string,
        email?: string,
        SubRole?: string,
        WorkStation?: string,
        nameid?: string
    ) {
        this.UserRoles = UserRoles;
        this.currentRole = currentRole;
        this.role = role;
        this.email = email;
        this.SubRole = SubRole;
        this.WorkStation = WorkStation;
        this.nameid = nameid;
    }
}