import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-espace-partenaire',
  templateUrl: './espace-partenaire.component.html',
  styleUrls: ['./espace-partenaire.component.scss']
})
export class EspacePartenaireComponent implements OnInit {

  apiUrl: string;

  constructor() { }

  ngOnInit() {
    this.apiUrl = environment.swaggerUrl;
  }

}
