import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'store-app',
  moduleId: module.id,
  templateUrl: `store-app.component.html`,
  styleUrls: [`store-app.component.css`]
})
export class StoreAppComponent implements OnInit {
  app_id: string;
  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.app_id = this.route.snapshot.params["id"];
  }
  
}