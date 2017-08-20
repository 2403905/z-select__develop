import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZSelectComponent } from "./z-select.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ZSelectComponent],
  exports:[ZSelectComponent]
})
export class ZSelectModule { }
