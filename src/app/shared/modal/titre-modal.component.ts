import { Component, OnInit, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-titre-modal',
    templateUrl: './titre-modal.component.html',
    styleUrls: ['./titre-modal.component.scss']
})
export class TitreModalComponent implements OnInit {

    titre: string;

    validate: Subject<{ titre: string }> = new Subject();

    constructor(
        public bsModalRef: BsModalRef
    ) { }

    ngOnInit() { }

    submit() {
        this.validate.next({
            titre: this.titre
        });
        this.bsModalRef.hide();
    }
}
