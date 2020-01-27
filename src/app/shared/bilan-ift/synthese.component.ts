import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

import { Bilan, BilanParcelleCultivee } from './bilan.model';
import { BilanIftService } from './bilan-ift.service';

@Component({
    selector: 'app-synthese',
    templateUrl: './synthese.component.html',
    styleUrls: ['./synthese.component.scss']
})
export class SyntheseComponent implements OnInit, OnChanges {

    @Input() bilan: Bilan;

    segments = [
        {
            key: 'semences',
            libelle: 'Semences'
        },
        {
            key: 'biocontrole',
            libelle: 'Biocontrôle'
        },
        {
            key: 'herbicide',
            libelle: 'Herbicide'
        },
        {
            key: 'insecticidesAcaricides',
            libelle: 'Insecticides acaricides'
        },
        {
            key: 'fongicidesBactericides',
            libelle: 'Fongicides bactéricides'
        },
        {
            key: 'autres',
            libelle: 'Autres'
        }];

    segmentTotal = {
        key: 'total',
        libelle: 'Total'
    };

    bilanByParcelle;
    bilanByCulture;

    parcelleChartData: ChartItem[];
    cultureChartData: ChartItem[];

    parcelles: string[] = [];
    cultures: string[] = [];

    constructor(private bilanIftService: BilanIftService) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.bilan) {
            this.bilanByParcelle = this.bilanIftService.groupByParcelle(this.bilan);
            this.bilanByCulture = this.bilanIftService.groupByCulture(this.bilan);

            this.parcelles = Object.keys(this.bilanByParcelle);
            this.cultures = Object.keys(this.bilanByCulture);
            this.updateCharts();
        } else {
            this.bilanByParcelle = {};
            this.bilanByCulture = {};
            this.parcelles = Object.keys(this.bilanByParcelle);
            this.cultures = Object.keys(this.bilanByCulture);
            this.updateCharts();
        }
    }

    private updateCharts() {
        if (this.bilan.bilanParcellesCultivees && this.bilan.bilanParcellesCultivees.length > 0) {
            this.parcelleChartData = this.getChartData(this.bilanByParcelle);
            this.cultureChartData = this.getChartData(this.bilanByCulture);
        } else {
            this.parcelleChartData = [];
            this.cultureChartData = [];
        }
    }

    private getChartData(group) {
        const chartData = [];

        this.segments.forEach(segment => {
            const chartItem = {
                'name': segment.libelle,
                'series': []
            };

            Object.keys(group).forEach(key => {
                const totalParcelle = group[key];
                chartItem.series.push({ 'name': key, 'value': totalParcelle[segment.key] });
            });

            chartData.push(chartItem);
        });

        return chartData;
    }

    public get nbParcellesCultivees() {
        return this.bilan.bilanParcellesCultivees.length;
    }

    public getTraitementsTotal() {
        return this.bilan.bilanParcellesCultivees.reduce(function (previous, current) {
            return previous + current.parcelleCultivee.traitements.length;
        }, 0);
    }
}

export class ChartItem {
    name: string;
    series: ChartValue[];
}

export class ChartValue {
    name: string;
    value: string;
}
