import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-panel',
  templateUrl: './project-panel.component.html',
  styleUrls: ['./project-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
