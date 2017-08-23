import { Component, Input, Output, EventEmitter, HostListener,  ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { NgxGalleryHelperService } from './ngx-gallery-helper.service';

@Component({
    selector: 'ngx-gallery-image',
    templateUrl: './ngx-gallery-image.component.html',
    styleUrls: ['./ngx-gallery-image.component.scss']
})
export class NgxGalleryImageComponent implements OnInit, OnChanges {
    @Input() images: string[];
    @Input() clickable: boolean;
    @Input() selectedIndex: number;
    @Input() arrows: boolean;
    @Input() arrowsAutoHide: boolean;
    @Input() swipe: boolean;
    @Input() animation: string;
    @Input() size: string;

    @Output() onClick = new EventEmitter();
    @Output() onActiveChange = new EventEmitter();

    constructor(private elementRef: ElementRef, private helperService: NgxGalleryHelperService) {}

    ngOnInit(): void {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['images']) {
            this.selectedIndex = 0;
        }

        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    }

    handleClick(event: Event, index: number): void {
        if (this.clickable) {
            this.onClick.emit(index);

            event.stopPropagation();
            event.preventDefault();
        }
    }

    showNext(): void {
        if (this.canShowNext()) {
            this.selectedIndex++;
        }
        else {
            this.selectedIndex=0;
        }
        this.onActiveChange.emit(this.selectedIndex);
    }

    showPrev(): void {
        if (this.canShowPrev()){
            this.selectedIndex--;
        }
        else {
            this.selectedIndex = this.images.length - 1;
        }
        this.onActiveChange.emit(this.selectedIndex);
    }

    canShowNext(): boolean {
        if (this.images) {
            return this.selectedIndex < this.images.length - 1 ? true : false;
        } else {
            return false;
        }
    }

    canShowPrev(): boolean {
        if (this.images) {
            return this.selectedIndex > 0 ? true : false;
        } else {
            return false;
        }
    }
}
