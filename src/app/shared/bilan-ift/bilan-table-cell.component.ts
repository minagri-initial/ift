import { Component, Input } from '@angular/core';
import { BilanParSegment } from './bilan.model';

@Component({
    selector: 'app-bilan-table-cell',
    template: `
        <span *ngIf="total">{{ getSegmentValue() }}</span>
        <span *ngIf="!total">
            <i class="icon icon-spinner icon-spin"></i>
        </span>
    `
})
export class BilanTableCellComponent {
    @Input()
    total: BilanParSegment;

    @Input()
    segment: { key, libelle };

    getSegmentValue() {
        const value: number = this.total[this.segment.key];
        return value !== 0 ? value.toFixed(2) : '-';
    }
}
