import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Project2Service {

  private _tasks = new BehaviorSubject<ITask>({});
  tasks$ = this._tasks.asObservable();

  constructor() { }

  addTask(id: string, algorithm:{id: string, label: string}, graph:{id: string, label: string}) {
    const updatedTasks =  {...this._tasks.getValue()};
    if (algorithm.id === 'HopcroftKarp' || algorithm.id === 'Hungarian') {
      const newTask = {
        algorithm: algorithm, 
        graph: graph, 
        animationUrl: `http://127.0.0.1:9000/artifacts/${id}/animation-steps.mp4`,
        visualizationUrl: `http://127.0.0.1:9000/artifacts/${id}/visualized_graph.png`,
        isAnimationLoading: true, 
        isVisualizationLoading: true,
        isAnimationAvailable: false
      }
      updatedTasks[id] = newTask;
    } else {
      const newTask = {
        algorithm: algorithm, 
        graph: graph, 
        animationUrl: `http://127.0.0.1:9000/artifacts/${id}/animation-steps.mp4`,
        visualizationUrl: `http://127.0.0.1:9000/artifacts/${id}/visualized_graph.png`,
        isAnimationLoading: true, 
        isVisualizationLoading: true,
        isAnimationAvailable: true
      }
      updatedTasks[id] = newTask;
    }

    this._tasks.next(updatedTasks);
  }

  updateTaskAsComplete(id: string) {
    const updatedTasks =  this._tasks.getValue();
    if (updatedTasks[id]) {
      updatedTasks[id].isAnimationLoading = false;
      updatedTasks[id].isVisualizationLoading = false;
      this._tasks.next(updatedTasks);
    }
  }

  deleteTask(id: string) {
    const updatedTasks =  this._tasks.getValue();
    delete updatedTasks[id];
    this._tasks.next(updatedTasks);
  }

  deleteTasks() {
    this._tasks.next({});
  }
}

export interface ITask {
  [id: string]: {
    algorithm:{id: string; label: string}; 
    graph:{id: string; label: string};
    animationUrl: string;
    visualizationUrl: string;
    isAnimationAvailable: boolean;
    isAnimationLoading: boolean;
    isVisualizationLoading: boolean;
  }
}

export interface ISelectedTask {
    algorithm:{id: string; label: string}; 
    graph:{id: string; label: string};
    animationUrl: string;
    visualizationUrl: string;
    isAnimationAvailable: boolean;
    isAnimationLoading: boolean;
    isVisualizationLoading: boolean;
}
