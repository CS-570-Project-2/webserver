import { CommonModule } from '@angular/common';
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
    MatChipsModule
  ],
  templateUrl: './project2.component.html',
  styleUrl: './project2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Project2Component { 
  textareaInputValue = '';

  srcResult = null;
  visualizationControl = '';

  visualizationControls = ['Step By Step', 'Final Output'];
  algorithms = ['Maxflow Edmonds-Karp', 'Bipartile Hopcroft-Karp']
  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }
}
