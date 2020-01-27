import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-update-db-modal-content',
    templateUrl: './update-db-modal.component.html'
})
export class UpdateDbModalComponent implements OnInit {

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {
    }
}
