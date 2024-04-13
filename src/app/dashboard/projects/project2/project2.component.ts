import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared';
import { TravelSalesmanRoutingModule } from '../travel-salesman/travel-salesman-routing.module';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { OutputHandlingService } from 'src/app/services/output-handling.service';
import { Guid } from 'guid-typescript';
import { ITask, Project2Service } from './project2.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project2',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatSnackBarModule,
    TravelSalesmanRoutingModule,
    MatSlideToggleModule,
    HttpClientModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project2.component.html',
  styleUrl: './project2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Project2Component implements OnInit { 
  tasks$ = this.project2Service.tasks$;

  textareaInputValue = '';
  selectedGraph!: {label: string, id: string};
  selectedAlgorithm!: {label: string, id: string};
  selectedVisulazations: string[] = [];
  selectedTask!: ITask;

  visualizationControls = [
    {label: 'Step By Step', id: 'stepByStep'}, 
    {label: 'Final Output', id:'finalOutput'}
  ];
  algorithms = [
    {label:'Edmonds-Karp', id: 'EdmondsKarp'}, 
    {label: 'Ford Fulkerson', id: 'FordFulkerson'}, 
    {label: 'Hopcroft-Karp', id: 'HopcroftKarp'}, 
    {label: 'Hungarian', id:'Hungarian'}];
  graphs = [{label: 'Input', id:'input'}];

  constructor(private _mqttService: MqttService, private alertService: OutputHandlingService, private project2Service: Project2Service) {
    this._mqttService.observe('edmondsKarp').subscribe((message: IMqttMessage) => {
      console.warn(message);
    });
  }
  ngOnInit(): void {
    this._mqttService.connect();
  }

  visualizationCheckboxChanged(visualization:string, checked: boolean) {
    if (checked) {
      this.selectedVisulazations.push(visualization);
    } else {
      this.selectedVisulazations = this.selectedVisulazations.filter((id) => id != visualization)
    }
  }

  selectedAlgorithmChanged(algorithmId: string) {
    this.selectedGraph = null;
    if (algorithmId === 'HopcroftKarp' || algorithmId === 'Hungarian') {
      this.graphs = [
        {label: 'Input', id: 'input'}, 
        {label: 'Matching Problem 1', id: 'MatchProblem-1'},
        {label: 'Matching Problem 2', id: 'MatchProblem-2'},
        {label: 'Matching Problem 3', id: 'MatchProblem-3'},
      ];
    } else if (algorithmId === 'EdmondsKarp' || algorithmId === 'FordFulkerson') {
      this.graphs = [
        {label: 'Input', id: 'input'}, 
        {label: 'Max Flow 1', id: 'MaxFlow-1'},
        {label: 'Max Flow 2', id: 'MaxFlow-2'},
        {label: 'Max Flow 3', id: 'MaxFlow-3'},
      ];
    }
  }

  run() {
    const id = Guid.create();
    const parsedInput = this.textareaInputValue.replace(/\n/g, ',').replace(/\s/g, '-');

    if (this.selectedGraph.id === 'input') {
      this._mqttService.publish(this.selectedAlgorithm.id, `${id}:CLIENT_TASK_INIT_FILE:${parsedInput}`).subscribe((observer) => {
        this.project2Service.addTask(id, this.selectedAlgorithm, this.selectedGraph);
      });
    } else {
      this._mqttService.publish(this.selectedAlgorithm.id, `${id}:CLIENT_TASK_INIT_FILE:${this.selectedGraph.id}`).subscribe((observer) => {
        this.project2Service.addTask(id, this.selectedAlgorithm, this.selectedGraph);
      });
    }

    
  }

  runTest() {
    this.selectedTask;
    debugger;
  }
}
