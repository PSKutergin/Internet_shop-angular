import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoryWithTypeType } from 'src/app/types/category-with-type.type';
import { CategoryType } from 'src/app/types/category.type';
import { TypeType } from 'src/app/types/type.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

  getCategoriesWithTypes(): Observable<CategoryWithTypeType[]> {
    return this.http.get<TypeType[]>(environment.api + 'types')
      .pipe(
        map((items: TypeType[]) => {
          const array: CategoryWithTypeType[] = [];

          items.forEach((item: TypeType) => {
            const foundItem = array.find(arraItem => arraItem.url === item.category.url);

            if (foundItem) {
              foundItem.types.push({
                id: item.id,
                name: item.name,
                url: item.url
              })
            } else {
              array.push({
                id: item.category.id,
                name: item.category.name,
                url: item.category.url,
                types: [{
                  id: item.id,
                  name: item.name,
                  url: item.url
                }]
              })
            }
          })

          return array;
        })
      )
  }
}
