import 'es6-shim';
import 'reflect-metadata';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { DateValueAccessor } from './date-value-accessor';
import { DateValueAccessorModule } from './module';

TestBed.initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting()
);

@Component({
	template: `
  <form>
    <input type="date" name="normalInput" [(ngModel)]="testDate1">
    <input type="date" name="fixedInput" [(ngModel)]="testDate2" useValueAsDate>
  </form>`
})
export class TestFormComponent {
	testDate1: Date;
	testDate2: Date;

	constructor() {
		this.testDate1 = new Date('2016-07-22');
		this.testDate2 = new Date('2016-09-15');
	}
}

@NgModule({
	declarations: [TestFormComponent],
	imports: [FormsModule, DateValueAccessorModule],
	exports: [TestFormComponent, DateValueAccessor]
})
export class DummyModule {}

function dispatchEvent(
	inputElement: HTMLInputElement,
	fixture: ComponentFixture<TestFormComponent>,
	text: string
) {
	inputElement.value = text;
	inputElement.dispatchEvent(new Event('input'));
	fixture.detectChanges();
	return fixture.whenStable();
}

describe('DateValueAccessor', () => {
	const dateString = new Date().toISOString().substring(0, 10);
	let fixture: ComponentFixture<TestFormComponent>;
	let component: TestFormComponent;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				imports: [FormsModule, DummyModule]
			});

			fixture = TestBed.createComponent(TestFormComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	describe('without the "useValueAsDate" attribute', () => {
		let normalInput: DebugElement;
		beforeEach(
			() =>
				(normalInput = fixture.debugElement.query(
					By.css('input[name=normalInput]')
				))
		);

		it('should NOT fix date input controls', () => {
			expect(normalInput.nativeElement.value).toBe('');
		});

		it(
			'should populate simple strings on change',
			async(() => {
				dispatchEvent(normalInput.nativeElement, fixture, dateString).then(
					() => {
						expect(component.testDate1 as any).toEqual(dateString);
					}
				);
			})
		);
	});

	describe('with the "useValueAsDate" attribute', () => {
		let fixedInput: DebugElement;
		beforeEach(
			() =>
				(fixedInput = fixture.debugElement.query(
					By.css('input[name=fixedInput]')
				))
		);

		it('should fix date input controls to bind on dates', () => {
			expect(fixedInput.nativeElement.value).toBe(
				component.testDate2.toISOString().substring(0, 10)
			);
		});

		it(
			'should also populate dates (instead of strings) on change',
			async(() => {
				dispatchEvent(fixedInput.nativeElement, fixture, dateString).then(
					() => {
						expect(component.testDate2).toEqual(jasmine.any(Date));
						expect(component.testDate2).toEqual(new Date(dateString));
					}
				);
			})
		);
	});
});
