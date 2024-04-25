import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared';
import { TravelSalesmanRoutingModule } from '../travel-salesman/travel-salesman-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-max-clique',
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
    MatProgressSpinnerModule  ],
  templateUrl: './max-clique.component.html',
  styleUrl: './max-clique.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaxCliqueComponent { 

  testCatigories: string[] = [
    'D5G1000', 'D8G700', 'D11G400', 'D14G100', 'Q15V100', 'Q30V400', 'Q45V700', 'Q60V1000'
  ];
  selectedCat: string;
  algoCatigories: string[] = [
    'Greedy Approach', 'Brute Force', 'Inverse Graph'
  ];
  selectedAlgoCat: string = 'Greedy Approach';
  graph: Map<string, string[]> =  new Map([
    ["1", ["2", "3"]],
    ["2", ["1", "3", "4"]],
    ["3", ["1", "2", "4", "5"]],
    ["4", ["2", "3", "5"]],
    ["5", ["3", "4"]],
  ]);
  maxClique: string[] = [];

  constructor(private httpClient: HttpClient) {
    this.init();
  }

    /** Sets up the matrices */
    init() {
      if (this.selectedCat) {
        this.httpClient.get(`assets/max-clique/${this.selectedCat}.txt`, {responseType: 'text'})
        .subscribe(data => {
          this.graph.clear();
          data.split('\n').forEach((x) => {
            const row = x.split(' ');
            this.graph.set(row[0], row.slice(1))
          })
        });
      }
    }

    graphChanged() {
      this.init();
    }

    run() {
      switch (this.selectedAlgoCat) {
        case 'Greedy Approach':
          this.maxClique = this.findMaxCliqueGreedy(this.graph);
          break;
        case 'Brute Force':
          this.maxClique = this.findMaxCliqueBruteForce(this.graph);
          break;
        case 'Inverse Graph':
          this.maxClique = this.findMaxCliqueInverseGraph(this.graph);
          break; 
        default:
          break;
      }
    }

    clear() {
      this.maxClique = [];
      this.selectedCat = null;
      this.selectedAlgoCat = null;
    }

  
  /**
    Takes a graph as input.
    Converts graph keys (vertices) to an array vertices.
    Initializes maxClique as an empty array.
    Iterates over possible subset sizes from 1 to the number of vertices (n).
    Uses a helper function getCombinations (or an external library) to generate all possible subsets of size i from vertices.
    For each subset, checks if it's a clique using isClique.
    If a clique is found and its size is greater than the current maxClique, updates maxClique.
    Returns the array containing the vertices of the maximum clique.
   */
  findMaxCliqueBruteForce(graph: Map<string, string[]>): string[] {
    const vertices = Array.from(graph.keys());
    let maxClique: string[] = [];
    for (let i = 1; i <= vertices.length; i++) {
        this.getCombinations(vertices, i).forEach((subset) => {
          if (this.isClique(graph, subset) && subset.length > maxClique.length) {
            maxClique = subset;
          }
        })
    }
    return maxClique;
  }

  /**
    Takes a graph as input.
    Converts graph keys (vertices) to an array vertices.
    Initializes maxClique as an empty array.
    Iterates over possible subset sizes from 1 to the number of vertices (n).
    Uses getCombinations to generate all possible subsets of size i from vertices
    If a clique is found and its size is greater than the current maxClique, updates maxClique.
    Returns the array containing the vertices of the maximum clique in the original graph (which is the complement of the clique in the inverse graph).
    */
   findMaxCliqueInverseGraph(graph: Map<string, string[]>): string[] {
    const vertices = Array.from(graph.keys());
    let maxClique: string[] = [];
  
    // Generate all possible subsets of vertices.
    for (let i = 1; i <= vertices.length; i++) {
        this.getCombinations(vertices, i).forEach((subset) => {
        // Create a sub-graph induced by the subset.
        const subGraph = new Map();
          subset.forEach((vertex) => {
            subGraph.set(vertex, []);
          });
          subset.forEach((vertex1) => {
              subset.forEach((vertex2) => {
                if (vertex1 !== vertex2 && !graph.get(vertex1)?.includes(vertex2)) {
                  subGraph.get(vertex1)?.push(vertex2);
                }
              });
          });   
  
        // Check if the sub-graph is a clique.
        if (this.isClique(subGraph, subset) && subset.length > maxClique.length) {
          maxClique = subset;
        }
        });

    }
    return maxClique;
  }

   findMaxCliqueGreedy(graph: Map<string, string[]>): string[] {
    const vertices = Array.from(graph.keys());
    const maxClique: string[] = [];
  
    while (vertices.length > 0) {
      // Find vertex with most connections to unselected vertices.
      let maxConnectedVertex = vertices[0];
      let maxConnections = 0;
        vertices.forEach((vertex) => {
          const connections = graph.get(vertex)?.filter(v => vertices.includes(v)).length || 0;
          if (connections > maxConnections) {
            maxConnectedVertex = vertex;
            maxConnections = connections;
          }
        });
  
      // Add the vertex to the clique and remove its neighbors from remaining vertices.
      maxClique.push(maxConnectedVertex);
      vertices.splice(vertices.indexOf(maxConnectedVertex), 1);
      for (let i = vertices.length - 1; i >= 0; i--) {
        if (graph.get(maxConnectedVertex)?.includes(vertices[i])) {
          vertices.splice(i, 1);
        }
      }
    }
  
    return maxClique;
  }
  
    /**
    Takes a graph (represented as a Map<string, string[]>) and a subset of vertices as input.
    Iterates through each vertex in the subset.
    Checks if all its neighbors are also in the subset.
    Returns true if all neighbors are present, indicating a clique; false otherwise.
   */
    isClique(graph: Map<string, string[]>, subset: string[]): boolean {
      let returnValue = true;
        subset.forEach((vertex) => {
            (graph.get(vertex) || []).forEach((neighbor) => {
              if (!subset.includes(neighbor)) {
                returnValue = false;
              }
            });
        });
      return returnValue;
    }


  /** Helper function to generate combinations (replace with an external library if needed)*/ 
  getCombinations<T>(arr: T[], n: number): T[][] {
    const results: T[][] = [];
  
    //  This is a basic implementation to generate combinations.
    //  It recursively generates all combinations of size n from the given array arr
    function helper(i: number, curr: T[], chosen: number) {
      if (chosen === n) {
        results.push([...curr]);
        return;
      }
  
      if (i === arr.length) {
        return;
      }
  
      curr.push(arr[i]);
      helper(i + 1, curr, chosen + 1);
      curr.pop();
      helper(i + 1, curr, chosen);
    }
  
    helper(0, [], 0);
    return results;
  }

}
