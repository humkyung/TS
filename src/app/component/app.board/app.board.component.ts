import { Component, OnInit } from '@angular/core';
// import { ThemeService } from '../core/services/theme.service';
import { Observable } from 'rxjs';

import { EngineComponent } from 'src/app/engine/engine.component';

@Component({
  selector: 'app-app.board',
  templateUrl: './app.board.component.html',
  styleUrls: ['./app.board.component.css']
})
export class AppBoardComponent implements OnInit {

  constructor() {
     }

  ngOnInit(): void {
  }
}
