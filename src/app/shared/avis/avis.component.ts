import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Avis } from './avis.model';
import { AvisService } from './avis.service';

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.scss']
})
export class AvisComponent implements OnInit {

  public avisIsVisible: boolean;

  public previousFocus;

  avis: Avis = new Avis;

  constructor(
    private _el: ElementRef,
    private avisService: AvisService
  ) { }

  ngOnInit() {
  }

  showAvis(event: any) {
    event.stopPropagation();

    this.avisIsVisible = true;
    this.previousFocus = document.activeElement;
  }

  focus(query)  {
    const focusedElement = this._el.nativeElement.querySelector(query);
    focusedElement.focus();
  }

  hideAvis() {
    this.avis = new Avis;
    this.avisIsVisible = false;
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  setNote(note: number) {
    this.avis.note = note;
  }

  onSubmit() {
    this.avisService.addAvis(this.avis)
      .subscribe(
      (response) => {
        this.hideAvis();
      }
      );
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    if (event.keyCode === 27) { // ECHAP
      this.hideAvis();
    }
  }

}
