# DateValueAccessor for Angular

[![Build Status](https://travis-ci.org/gastro-instruments/angular-date-value-accessor.svg?branch=master)](https://travis-ci.org/gastro-instruments/angular-date-value-accessor)

A custom value accessor for Angular 5.  
Now you can use JavaScript Date objects directly with two-way data bindings (ngModel) as well as with reactive forms (formControlName/formControl).

## Examples:

You have to explicitly opt-in by adding the attribute `useValueAsDate` to a date input control:

```html
<input type="date" name="myBirthday" ngModel useValueAsDate>

OR

<input type="date" name="myBirthday" [(ngModel)]="myBirthday" useValueAsDate>

OR

<input type="date" formControlName="myBirthday" useValueAsDate>
```

## Installation:

Download the package via NPM:

```bash
yarn add @gi/angular-date-value-accessor
npm install --save @gi/angular-date-value-accessor
```

Then import the module via NgModule:

```js
// app.module.ts

import { DateValueAccessorModule } from '@gi/angular-date-value-accessor';

@NgModule({
	imports: [DateValueAccessorModule]
})
export class AppModule {}
```

## Demo

There is a demo at:
http://johanneshoppe.github.io/angular-date-value-accessor/
