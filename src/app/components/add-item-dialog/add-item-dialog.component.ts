import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent {
  cardForm: FormGroup;
  isChild: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isChild = data.isChild;
    this.cardForm = this.fb.group({
      title: [''],
      description: this.isChild ? [''] : null,
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      this.dialogRef.close(this.cardForm.value);
    }
  }
}