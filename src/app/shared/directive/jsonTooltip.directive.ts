import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[jsonTooltip]',
  standalone: true
})
export class JsonTooltipDirective {
  @Input('jsonTooltip') jsonData: any;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    const tooltip = document.createElement('div');
    tooltip.innerText = JSON.stringify(this.jsonData, null, 2);
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.padding = '10px';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.zIndex = '9999';
    tooltip.style.top = (this.elementRef.nativeElement.offsetTop + this.elementRef.nativeElement.offsetHeight) + 'px';
    tooltip.style.left = this.elementRef.nativeElement.offsetLeft + 'px';
    document.body.appendChild(tooltip);
  }

  private hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
}
