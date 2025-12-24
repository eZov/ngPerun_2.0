export class ToastApp {

    constructor(
        public title: string,
        public content: string,
        public cssClass?: string,
        public icon?: string,
        public timeOut?: number,
        public showCloseButton?: boolean,
        public showButtons?: boolean,
        public notificationId?: number
    ) { }
}
