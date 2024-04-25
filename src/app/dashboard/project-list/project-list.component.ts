import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  constructor(private navigation: NavigationService) { }

  ngOnInit(): void {
  }

  goToTravelingSalesman () {
    this.navigation.viewTravelingSalesman();
  }
  goToProject2 () {
    this.navigation.viewProject2();
  }
  goToMaxClique () {
    this.navigation.viewMaxClique();
  }
}
