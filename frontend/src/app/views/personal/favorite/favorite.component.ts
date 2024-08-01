import { Component, OnInit } from '@angular/core';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { FavoriteType } from 'src/app/types/favorite.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  favorites: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.favorites = data as FavoriteType[]
      });
  }

  removeFromFavorites(id: string): void { }

}
