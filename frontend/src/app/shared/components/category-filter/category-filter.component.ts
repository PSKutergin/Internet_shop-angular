import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { ActiveParamsType } from 'src/app/types/active-params.type';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';
import { ActiveParamsUtil } from '../../utils/active-params.util';

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
  from: number | null = null;
  to: number | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.activeParams = ActiveParamsUtil.processParams(params as ActiveParamsType);

      if (this.type) {
        if (this.type === 'height') {
          this.open = !!(this.activeParams.heightFrom || this.activeParams.heightTo);
          this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null;
          this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null;
        }
        if (this.type === 'diameter') {
          this.open = !!(this.activeParams.diameterFrom || this.activeParams.diameterTo);
          this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null;
          this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null;
        }
      } else {
        if (params['types']) this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];

        this.open = !!(this.categoryWithTypes && this.categoryWithTypes.types && this.categoryWithTypes.types.length > 0 &&
          this.categoryWithTypes.types.some(type => this.activeParams.types.find((activeType) => activeType === type.url)));
      }
    });
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
        // this.activeParams.types.push(url);
        this.activeParams.types = [...this.activeParams.types, url];
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], { queryParams: this.activeParams });
  }

  updateFilterParamFromTo(param: string, value: string): void {
    if (param === 'heightFrom' || param === 'diameterFrom' || param === 'heightTo' || param === 'diameterTo') {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = value;
      }

      this.activeParams.page = 1;
      this.router.navigate(['/catalog'], { queryParams: this.activeParams });
    }
  }

}
