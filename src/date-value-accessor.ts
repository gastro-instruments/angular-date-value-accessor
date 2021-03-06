import {
	Directive,
	ElementRef,
	forwardRef,
	HostListener,
	Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DateValueAccessor),
	multi: true
};

/**
 * The accessor for writing a value and listening to changes on a date input element
 *
 *  ### Example
 *  `<input type="date" name="myBirthday" ngModel useValueAsDate>`
 *  OR
 *  `<input type="date" formControlName="myBirthday" useValueAsDate>`
 */
@Directive({
	// this selector changes the previous behavior silently and might break existing code
	// selector: 'input[type=date][formControlName],input[type=date][formControl],input[type=date][ngModel]',

	// this selector is an opt-in version
	selector: '[useValueAsDate]',
	providers: [DATE_VALUE_ACCESSOR]
})
export class DateValueAccessor implements ControlValueAccessor {
	@HostListener('input', ['$event.target.valueAsDate'])
	onChange = (_: any) => {};
	@HostListener('blur', [])
	onTouched = () => {};

	constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

	/** Write a new value to the elment (model -> view) */
	writeValue(value: Date): void {
		if (!value) {
			this._renderer.setProperty(this._elementRef.nativeElement, 'value', null);
			return;
		}
		this._renderer.setProperty(
			this._elementRef.nativeElement,
			'valueAsDate',
			value
		);
	}

	/** Register function called when value changes (view -> model) */
	registerOnChange(fn: (_: any) => void): void {
		this.onChange = fn;
	}

	/** Register function when the control blurred */
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	/** Enable or disable the element when the control status changes */
	setDisabledState(isDisabled: boolean): void {
		this._renderer.setProperty(
			this._elementRef.nativeElement,
			'disabled',
			isDisabled
		);
	}
}
