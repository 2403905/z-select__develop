import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  val: string = '';
  optionsArray: any[] = [{value: '1', label: 'das'}];

  constructor() {
    // setTimeout(()=>{
    //   this.val =  '1';
    // }, 5000);
    this.generateItems(100);
  }

  generateItems(n: number) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        arr.push(this.generageItem(i));

      }, 2);
    }

    this.optionsArray = arr;
  }

  generageItem(a: number = 0) {
    const now = Math.random() * 1000;
    const str = `item #${a}: ${now}`;
    return {value: str, label: str}
  }
}
