import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Bilan, BilanIftService } from '../shared/bilan-ift';

@Component({
    selector: 'app-verifier-bilan',
    templateUrl: './verifier-bilan.component.html',
    styleUrls: ['./verifier-bilan.component.scss']
})
export class VerifierBilanComponent implements OnInit {

    bilan: Bilan;
    id: string;

    constructor(private route: ActivatedRoute,
        private bilanIftService: BilanIftService) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                if (params.id) {
                    this.id = params.id;
                    this.getBilan();
                }
            });
    }

    private getBilan() {
        this.bilanIftService.get(this.id).subscribe(
            (response: Bilan) => {
                this.bilan = response;
            }
        );
    }
}
