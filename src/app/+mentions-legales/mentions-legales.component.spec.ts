import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MentionsLegalesComponent } from './mentions-legales.component';

describe('Component: MentionsLegales', () => {
  let component: MentionsLegalesComponent;
  let fixture: ComponentFixture<MentionsLegalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        MentionsLegalesComponent,
      ],
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionsLegalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
