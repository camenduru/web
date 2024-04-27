import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasonryLayoutContainerComponent } from './masonry-layout-container.component';

describe('MasonryLayoutContainerComponent', () => {
  let component: MasonryLayoutContainerComponent;
  let fixture: ComponentFixture<MasonryLayoutContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MasonryLayoutContainerComponent],
    });
    fixture = TestBed.createComponent(MasonryLayoutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
