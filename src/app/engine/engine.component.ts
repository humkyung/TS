import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { NodeService } from 'src/app/service/rest-api/node.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  public constructor(
    private engServ: EngineService,
    private nodeServ: NodeService) { }

  public ngOnInit(): void {
    this.nodeServ.getNodes()
    .then(response => {
      this.engServ.createScene(this.rendererCanvas, response);
      this.engServ.animate();
    });
  }
}