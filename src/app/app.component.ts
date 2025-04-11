import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from './components/add-item-dialog/add-item-dialog.component';

interface ChildCard {
  title: string;
  description: string;
  creationTime: string;
}

interface ParentCard {
  title: string;
  children: ChildCard[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cards: ParentCard[] = [];

  constructor(private dialog: MatDialog) {
    this.loadCards();
  }

  openAddParentCardDialog() {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: { isChild: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addParentCard(result.title);
      }
    });
  }

  openAddChildCardDialog(parentIndex: number) {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      data: { isChild: true }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addToCard(parentIndex, result);
      }
    });
  }

  addParentCard(title: string) {
    const newParentCard: ParentCard = {
      title,
      children: []
    };
    this.cards.push(newParentCard);
    this.saveCards();
  }

  drag(event: DragEvent, parentIndex: number, childIndex: number) {
    event.dataTransfer?.setData('text/plain', `${parentIndex},${childIndex}`);
  }

  drop(event: DragEvent, parentIndex: number) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const [sourceParentIndex, childIndex] = data.split(',').map(Number);
      if (sourceParentIndex !== parentIndex) {
        const child = this.cards[sourceParentIndex].children.splice(childIndex, 1)[0];
        this.cards[parentIndex].children.push(child);
        this.sortChildrenByCreationTime(parentIndex);
      }
    }
  }

  sortChildrenByCreationTime(parentIndex: number) {
    this.cards[parentIndex].children.sort((a, b) => 
      new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
    );
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  addToCard(parentIndex: number, childData: any) {
    const newChildCard: ChildCard = {
      title: childData.title,
      description: childData.description,
      creationTime: new Date().toLocaleString()
    };
    this.cards[parentIndex].children.push(newChildCard);
    this.sortChildrenByCreationTime(parentIndex);
    this.saveCards();
  }

  removeParentCard(index: number) {
    this.cards.splice(index, 1);
    this.saveCards();
  }

  removeChildCard(parentIndex: number, childIndex: number) {
    this.cards[parentIndex].children.splice(childIndex, 1);
    this.saveCards();
  }

  saveCards() {
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }

  loadCards() {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      this.cards = JSON.parse(savedCards);
    }
  }
}