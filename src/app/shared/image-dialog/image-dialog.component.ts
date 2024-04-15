import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    imageUrl: string;
    algorithmLabel: string;
    graphLabel: string;
  }) {}
 }
