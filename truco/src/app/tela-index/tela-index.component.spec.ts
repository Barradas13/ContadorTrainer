import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaIndexComponent } from './tela-index.component';

describe('TelaIndexComponent', () => {
  let component: TelaIndexComponent;
  let fixture: ComponentFixture<TelaIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
