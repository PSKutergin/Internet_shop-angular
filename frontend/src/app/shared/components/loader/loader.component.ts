import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isShow: boolean = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.isShowed$.subscribe((isShow: boolean) => {
      this.isShow = isShow
    })
  }

}
