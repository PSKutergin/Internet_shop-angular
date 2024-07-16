import { Component, Input, OnInit } from '@angular/core';
import { CategoryType } from 'src/app/types/category.type';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() categories: CategoryType[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
