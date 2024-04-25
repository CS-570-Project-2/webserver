import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private store: Store) { }

  viewDashboard() {
    this.store.dispatch(new Navigate(['/']))
  }

  viewTravelingSalesman() {
    this.store.dispatch(new Navigate(['/traveling-salesman']))
  }

  viewProject2() {
    this.store.dispatch(new Navigate(['/project2']))
  }

  viewMaxClique() {
    this.store.dispatch(new Navigate(['/max-clique']))
  }
}
