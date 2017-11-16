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
  public allNotes: NotesModel[] = [];

  constructor(
    public navCtrl: NavController,
    public notesService: NotesService
  ) { }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.notes = [];
    this.getNotes();
  }

  private getNotes(): void {
    // this.notes = [
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'primary', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'secondary', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' }, { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' }, { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' }, { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    // ]
    this.notesService.getAll()
      .then((notes: NotesModel[]) => {
        notes.forEach(element => {
          this.notes.push(element);
        })
        this.allNotes = this.notes;
      })
  }


  // FILTROS DE ELEMENTOS A PARTIR DO TEXTO DE UMA INPUT
  public filterItems(event: any): void {
    let searchTerm: string = event.target.value;
    this.notes = this.allNotes;

    if (searchTerm) {

      this.notes = this.notes.filter((item: NotesModel) => {
        return (item.title.toLocaleLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      })
    }
  }


  public viewNote(note?: NotesModel): void {
    if (!note) {
      this.navCtrl.push('NotesPage');
    } else {
      this.navCtrl.push('NotesPage', { note });
    }
  }

  public viewArchived(): void {
    this.navCtrl.push('ArchivedPage');
  }
}
