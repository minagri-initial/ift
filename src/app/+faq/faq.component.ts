import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, AfterViewInit {

  hasScroll = false;
  page = '';

  container: Element;
  cells: Element[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      const question = params.question;

      if (question && !this.hasScroll) {
        const element = document.getElementById(question);
        if (element) {
          const offset = document.getElementsByClassName('navbar') && document.getElementsByClassName('navbar')[0] ?
            document.getElementsByClassName('navbar')[0].clientHeight : 0;
          setTimeout(function () {
            element.scrollIntoView();
            window.scrollBy(0, -offset - 20);
            element.click();
          }, 0);
        }
      }
      this.hasScroll = true;
    });

    this.container = document.getElementById('faq');
    this.cells = this.toArray(
      document.getElementsByTagName('mat-panel-title')
    );
  }

  updateQuestionPage(page) {
    this.page = page;
    this.location.go('/faq/' + page);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event: any): void {
    const res = this.cells.find(cell => this.isChildElementVisible(this.container, cell));
    if (res && res.id !== this.page) {
      this.updateQuestionPage(res.id);
    }
  }

  isChildElementVisible(cont, element) {
    const offset = document.getElementsByClassName('navbar') && document.getElementsByClassName('navbar')[0] ?
      document.getElementsByClassName('navbar')[0].clientHeight : 0;

    const containerTop = window.pageYOffset + offset;
    const elemTop = element.parentElement.parentElement.offsetTop;
    const elemHeight = parseInt(getComputedStyle(element.parentElement.parentElement).height, 10);
    const elemBottom = elemTop + elemHeight;
    return (elemTop <= containerTop && elemBottom > containerTop);
  }

  toArray(arraylikeObject) {
    return Array.prototype.slice.call(arraylikeObject, 0);
  }

}
