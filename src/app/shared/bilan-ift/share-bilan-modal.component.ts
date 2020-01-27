import { Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Component({
    selector: 'app-share-bilan-modal',
    templateUrl: './share-bilan-modal.component.html',
    styleUrls: ['./share-bilan-modal.component.scss']
})
export class ShareBilanModalComponent {

    url: string;
    snackBarRef: MatSnackBarRef<SimpleSnackBar>;

    @ViewChild('inputUrl') inputUrl;

    constructor(public bsModalRef: BsModalRef,
        private matSnackBar: MatSnackBar) { }

    copyToClipboard() {
        this.inputUrl.nativeElement.select();
        document.execCommand('copy');
        this.matSnackBar.open('Copié !', null, { duration: 1000 });
    }
}
