import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared';
import { TravelSalesmanRoutingModule } from '../travel-salesman/travel-salesman-routing.module';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Guid } from 'guid-typescript';
import { ISelectedTask, Project2Service } from './project2.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'src/app/shared/image-dialog/image-dialog.component';

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
export class Project2Component implements OnInit, OnDestroy { 
  project2Subscription: Subscription;
  mqttObserveSubscription: Subscription;

  /** Tasks state observable. */
  tasks$ = this._project2Service.tasks$.pipe(map((tasks) => Object.keys(tasks).map(key => tasks[key])));

  /** Selected fields and parameters. */
  textareaInputValue = '';
  selectedGraph!: {label: string, id: string};
  selectedAlgorithm!: {label: string, id: string};
  selectedTask!: ISelectedTask;

  /** Algorithem selection list. */
  algorithms = [
    {label:'Edmonds-Karp', id: 'EdmondsKarp'}, 
    {label: 'Ford Fulkerson', id: 'FordFulkerson'}, 
    {label: 'Hopcroft-Karp', id: 'HopcroftKarp'}, 
    {label: 'Hungarian', id:'Hungarian'}];

  /** Graphs selection list. */
  graphs = [{label: 'User Input', id:'input'}];

  /**
   * Creates a new instance of the project 2 component.
   * 
   * @param _mqttService 
   *    The MQTT service.
   * @param _changeDetector 
   *    The change detector.
   * @param _project2Service 
   *    The project 2 state service.
   * @param _snackBar 
   *    Material Design snack bar service.
   * @param _matDialog 
   *    Material Design dialog service.
   */
  constructor(
    private _mqttService: MqttService, 
    private _changeDetector: ChangeDetectorRef, 
    private _project2Service: Project2Service, 
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog
  ) { }
 
  ngOnDestroy(): void {
    this.project2Subscription?.unsubscribe();
    this.mqttObserveSubscription?.unsubscribe();
    this._project2Service.deleteTasks();
  }
  
  ngOnInit(): void {
    // Connects to the MQTT WebSocket.
    this._mqttService.connect();

    // Observes the Logs topic and update the tasks state.
    this.mqttObserveSubscription = this._mqttService.observe('Logs').subscribe((observer: IMqttMessage) => {
      const payload = observer.payload.toString().split(':');
      const id = payload[0];
      const status = payload[1];
      if (status === "SERVER_TASK_FINISHED") {
        this._project2Service.updateTaskAsComplete(id);
      } else if (status === "SERVER_TASK_ERROR") {
        this.clear();
        this._changeDetector.detectChanges();
        this._project2Service.deleteTask(id);
        this._snackBar.open(payload[2].replace(/-/g, ' '), 'Dismiss');
      }
    });

    // Updates the selected task to the latest task.
    this.project2Subscription = this.tasks$.subscribe((tasks) => this.selectedTask = tasks[tasks.length-1]);
  }

  /**
   * Changes the Graphs selection list based on the selected alogrithm.
   * 
   * @param algorithmId 
   *    The alogrithm ID.
   */
  selectedAlgorithmChanged(algorithmId: string) {
    this.selectedGraph = null;
    if (algorithmId === 'HopcroftKarp' || algorithmId === 'Hungarian') {
      this.graphs = [
        {label: 'User Input', id: 'input'}, 
        {label: 'Matching Problem 1', id: 'MatchProblem-1.txt'},
        {label: 'Matching Problem 2', id: 'MatchProblem-2.txt'},
        {label: 'Matching Problem 3', id: 'MatchProblem-3.txt'},
      ];
    } else if (algorithmId === 'EdmondsKarp' || algorithmId === 'FordFulkerson') {
      this.graphs = [
        {label: 'User Input', id: 'input'}, 
        {label: 'Max Flow 1', id: 'MaxFlow-1.txt'},
        {label: 'Max Flow 2', id: 'MaxFlow-2.txt'},
        {label: 'Max Flow 3', id: 'MaxFlow-3.txt'},
      ];
    }
  }

  /**
   * Publishes the selected parameters to the WebSocket and updates the tasks list.
   */
  run() {
    const id = Guid.create();
    const parsedInput = this.textareaInputValue.replace(/\n/g, ',').replace(/\s/g, '-');

    if (this.selectedGraph.id === 'input') {
      this._mqttService.publish(this.selectedAlgorithm.id, `${id}:CLIENT_TASK_INIT_RAW:${parsedInput}`).subscribe((observer) => {
        this._project2Service.addTask(id.toString(), this.selectedAlgorithm, this.selectedGraph);
      });
    } else {
      this._mqttService.publish(this.selectedAlgorithm.id, `${id}:CLIENT_TASK_INIT_FILE:${this.selectedGraph.id}`).subscribe((observer) => {
        this._project2Service.addTask(id.toString(), this.selectedAlgorithm, this.selectedGraph);
      });
    }
  }

  /**
   * Opens the image dialog.
   * 
   * @param imageUrl 
   *    The image URL.
   * @param algorithmLabel 
   *    The alogrithm label.
   * @param graphLabel 
   *    The graph label.
   */
  openDialog(imageUrl :string, algorithmLabel: string, graphLabel: string) {
    this._matDialog.open(ImageDialogComponent, {
      data: {
        imageUrl: imageUrl,
        algorithmLabel: algorithmLabel,
        graphLabel: graphLabel
      }
    })
  }

  /** Clears all the input fields. */
  clear() {
    this.textareaInputValue = '';
    this.selectedAlgorithm = null;
    this.selectedGraph = null;
    this.selectedTask = null;
  }
}
