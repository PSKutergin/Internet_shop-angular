import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveParamsType } from 'src/app/types/active-params.type';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() categoryWithTypes: CategoryWithTypeType | null = null;
  @Input() type: string | null = null;
  open: boolean = false;
  activeParams: ActiveParamsType = { types: [] };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  get title(): string {
    if (this.categoryWithTypes) {
      return this.categoryWithTypes.name;
    }
    if (this.type) {
      if (this.type === 'height') {
        return 'Высота';
      }
      if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }
    return '';
  }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, checked: boolean): void {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find((type) => type === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter((type) => type !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.types.push(url);
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

}
