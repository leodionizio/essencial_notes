import { NotesModel } from './../../models/notes.model';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { NotesService } from './../../providers/notes/notes.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public notes: NotesModel[] = [];

  constructor(
    public navCtrl: NavController,
    public notesService: NotesService
  ) { }

  ionViewDidLoad() {
    this.getNotes();
  }

  private getNotes(): void {
    this.notesService.getAll()
      .then((notes: NotesModel[]) => {
        notes.forEach(element => {
          this.notes.push(element);
        })
      })
  }

  public viewNote(note?: NotesModel): void {
    if (!note) {
      this.navCtrl.setRoot('NotesPage');
    } else {
      this.navCtrl.setRoot('NotesPage', { note });
    }
  }
}
