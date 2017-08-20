import { Component, ElementRef, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { isNull, isUndefined } from "util";
import { Observable, Subscription } from "rxjs";

interface IitemModel {
  value: string;
  label: string;
}

@Component({
  selector: 'z-select',
  templateUrl: './template.html',
  host: {
    '(keydown)': 'keyupHandler($event)',
    '(click)': '$event.stopPropagation()',
    '[class.is-open]': '_isOpen',
    '[class.is-above]': 'isAbove'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ZSelectComponent),
    multi: true
  }],
  styleUrls: ['./styles.scss']
})
export class ZSelectComponent implements ControlValueAccessor {
  selectedItem: IitemModel;
  value: any;

  _options: IitemModel[];
  _placeholder: string = 'Select option';
  _hoverIndex: number = 0;
  _isOpen: boolean;

  _subscriptionToBodyClick: Subscription;
  optionsListEl: Element;
  latestListScroll: number = 0;

  @Input() set options(options: IitemModel[]) {
    if (this.optionsInvalid(options)) {
      throw new Error('options must be an array of objects: {value, label}');
    }

    this._options = options;
  }

  get options(): IitemModel[] {
    return this._options;
  }

  @Input() set placeholder(pls: string) {
    this._placeholder = pls;
  }

  get placeholder(): string {
    return this.selectedItem ? this.selectedItem.label : this._placeholder;
  }

  get isAbove(): boolean {
    return this.el.nativeElement.getBoundingClientRect().top + 210 > window.innerHeight;
  }

  constructor(private el: ElementRef) {

  }

  toggleDropdown() {
    this._isOpen ? this.closeDropdown() : this.openDropdown();
  }

  closeDropdown() {
    this._isOpen = false;
    this.el.nativeElement.querySelector('input[type=text]').blur();
    this.unsubscribeFromBodyClick();
    this.latestListScroll = this.optionsListEl.scrollTop;
  }

  openDropdown() {
    this._isOpen = true;
    setTimeout(() => {
      this.optionsListEl = this.el.nativeElement.querySelector('.z-select__options-list');
      this.optionsListEl.scrollTop = this.latestListScroll;
    }, 0);
    this.subscribeToBodyClick();
  }


  optionsInvalid(options: IitemModel[]): boolean {
    if (
      (isUndefined(options) || isNull(options)) ||
      Array.isArray(options) && options.every((el: IitemModel) =>
      el.hasOwnProperty('value') && typeof el.value === 'string' &&
      el.hasOwnProperty('label') && typeof el.label === 'string')) {
      return false;
    }
    return true;
  }

  trackByFn(index: number) {
    return index;
  }

  selectOptionHandler(option: IitemModel) {
    this.closeDropdown();
    this.writeValue(option.value);
    this.onTouched();
  }

  clearValue() {
    this.value = null;
    this.selectedItem = null;
    this.onChange(null);
  }

  keyupHandler(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.keyCode) {
      case 40:
        this._onArrowDown();
        break;
      case 38:
        this._onArrowUp();
        break;
      case 27:
        this.closeDropdown();
        break;
      case 13:
        this._onEnterKyeup();
        break;
    }
  }

  _onArrowDown() {
    if (this._hoverIndex + 1 < this.options.length) {
      ++this._hoverIndex;
      this._setListOptionsScroll('bottom');
    }
  }

  _onArrowUp() {
    if (this._hoverIndex - 1 >= 0) {
      this._hoverIndex--;
      this._setListOptionsScroll('top');
    }
  }

  _setListOptionsScroll(dir: 'top' | 'bottom') {
    const a = this.optionsListEl.querySelector(`li:nth-child(${this._hoverIndex + 1})`).getBoundingClientRect()[dir];
    const b = this.optionsListEl.getBoundingClientRect()[dir];

    if (dir === 'top' ? a < b : a > b) {
      this.optionsListEl.scrollTop = this.optionsListEl.scrollTop + (a - b);
    }
  }

  _onEnterKyeup() {
    const el = this.options[this._hoverIndex];
    if (el) {
      this.writeValue(el.value);
    }
    this.closeDropdown();
  }

  subscribeToBodyClick() {
    this._subscriptionToBodyClick = Observable.fromEvent(window, 'click').take(1).subscribe(() => {
      this.closeDropdown();
    });
  }

  unsubscribeFromBodyClick() {
    if (this._subscriptionToBodyClick) {
      this._subscriptionToBodyClick.unsubscribe();
      this._subscriptionToBodyClick = null;
    }
  }

  // ControlValueAccessor implement
  writeValue(value: string): void {
    if (value && typeof value === 'string') {
      const elFromOptions = this.options.find((el: IitemModel) => el.value === value);
      if (!elFromOptions) {
        this.clearValue();
        return;
      }

      this.selectedItem = elFromOptions;
      this.value = this.selectedItem.value;
      this.onChange(this.value);
    } else {
      this.clearValue();
    }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onTouched: Function = () => {
  };
  onChange: Function = () => {
  };
}
