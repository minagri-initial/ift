import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-update-bilan-modal',
    templateUrl: './update-bilan-modal.component.html'
})
export class UpdateBilanModalComponent implements OnInit {

    campagneLibelle: string;
    loading = false;

    validate: Subject<{}> = new Subject();

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {
    }

    confirm() {
        this.loading = true;
        this.validate.next({});
        this.bsModalRef.hide();
    }
}
