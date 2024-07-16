import { Component, Input, OnInit } from '@angular/core';
import { CategoryType } from 'src/app/types/category.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() categories: CategoryType[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
