import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnDestroy,
  Signal,
  SimpleChanges,
  TemplateRef,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgFor, NgTemplateOutlet, AsyncPipe } from '@angular/common';

export const unmatchedBreakpointKey = 'other';
export type MasonryLayoutBreakpointKeys = keyof typeof Breakpoints | typeof unmatchedBreakpointKey;
export type MasonryLayoutBreakpointsMap = Partial<Record<MasonryLayoutBreakpointKeys, number>>;

// See https://benjamin-maisonneuve1.medium.com/multiple-content-projections-in-angular-cc65f72ba519
@Component({
  selector: 'app-masonry-layout-container',
  templateUrl: './masonry-layout-container.component.html',
  styleUrls: ['./masonry-layout-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, AsyncPipe],
})
export class MasonryLayoutContainerComponent implements OnChanges, OnDestroy {
  @Input() items: unknown[] = [];
  @Input() breakpointsMap: MasonryLayoutBreakpointsMap = {};

  destroy$ = new Subject<void>();

  nrColumns = signal(1);
  itemsSignal = signal([]);
  columnItems: Signal<unknown[][]>;

  @ContentChild(TemplateRef) templateRef!: TemplateRef<unknown>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.columnItems = computed(() => this.divideIntoColumns(this.itemsSignal(), this.nrColumns()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']?.currentValue) {
      const currentItems = changes['items'].currentValue;
      // TODO: Use Angular's input as signals when available
      // https://github.com/angular/angular/discussions/49682
      // https://itnext.io/how-to-enjoy-signal-based-input-right-now-56efecaeee98
      this.itemsSignal.set(currentItems);
    }

    if (changes['breakpointsMap']?.currentValue) {
      const currentBreakpointsMap = changes['breakpointsMap'].currentValue;
      const breakpointKeysFiltered = Object.keys(currentBreakpointsMap).filter(key => key !== unmatchedBreakpointKey);

      this.breakpointObserver
        .observe(breakpointKeysFiltered)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ breakpoints }) => {
          const matchingBreakpointKey = Object.entries(breakpoints).find(([, isMatched]) => isMatched)?.[0];
          this.nrColumns.set(
            matchingBreakpointKey ? currentBreakpointsMap[matchingBreakpointKey] : currentBreakpointsMap[unmatchedBreakpointKey] || 1,
          );
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  divideIntoColumns(items: unknown[], nrColumns: number): unknown[][] {
    const arr = [];
    for (let colNr = 0; colNr < nrColumns; colNr++) {
      arr.push(items.filter((_val, index: number) => index % nrColumns === colNr));
    }

    return arr;
  }
}
