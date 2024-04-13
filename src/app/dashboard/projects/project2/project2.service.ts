import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Project2Service {

  private _tasks = new BehaviorSubject<ITask[]>([]);
  tasks$ = this._tasks.asObservable();

  constructor() { }

  addTask(id: Guid, algorithm:{id: string, label: string}, graph:{id: string, label: string}) {
    const updatedTasks =  this._tasks.getValue();
    let currentTask = updatedTasks.find((task) => task.id === id);
    if (!currentTask) {
      updatedTasks.push({id: id, algorithm: algorithm, graph: graph, isAnimationLoading: true, isVisualizationLoading: true});
    }
    this._tasks.next(updatedTasks);
  }
}

export interface ITask {
  id: Guid; 
  algorithm:{id: string; label: string}; 
  graph:{id: string; label: string};
  isAnimationLoading: boolean;
  isVisualizationLoading: boolean;
}
