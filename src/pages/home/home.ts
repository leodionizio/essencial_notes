import { NotesModel } from './../../models/notes.model';
import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';

import { NotesService } from './../../providers/notes/notes.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public notes: NotesModel[] = [];
  public allNotes: NotesModel[] = [];

  // 0 - data edição
  // 1 - data criação
  // 2 - alfabética
  public typeOrder: number = 0;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public notesService: NotesService
  ) { }

  ionViewDidLoad() {
    window.scrollTo(0, 0);
  }

  ionViewWillEnter() {
    this.notes = [];
    this.getNotes();
  }

  private getNotes(): void {
    // this.notes = [
    //   { id: 1, key: 'A', title: 'A Alguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'B', title: 'BAlguma coisa', color: 'primary', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'C', title: 'CAlguma coisa', color: 'secondary', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'D', title: 'DAlguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'E', title: 'EAlguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'F', title: 'FAlguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'G', title: 'GAlguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'AAlguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'B', title: 'BAlguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' }, { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'T', title: 'TAlguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'U', title: 'UAlguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' }, { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'AAlguma coisa', color: 'dark', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'AAlguma coisa', color: 'purple', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' }, { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', archived: 0, content: 'aniotação teste', date_created: '', date_edited: '' },
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
    this.navCtrl.setRoot('ArchivedPage');
  }

  public orderBy() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Ordenar por:');
    alert.setCssClass('alert')

    alert.addInput({
      type: 'radio',
      label: 'Data de Edição',
      value: 'dateEdited',
      checked: this.typeOrder === 0 ? true : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Data de Criação',
      value: 'dateCreated',
      checked: this.typeOrder === 1 ? true : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Ordem Alfabética',
      value: 'alphabetical',
      checked: this.typeOrder === 2 ? true : false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'dateEdited') {

          this.notes.sort((a, b) => {
            if (a.date_edited < b.date_edited) return -1;
            if (a.date_edited > b.date_edited) return 1;
            return 0;
          })

        } else if (data === 'dateCreated') {

          this.notes.sort((a, b) => {
            if (a.date_created < b.date_created) return -1;
            if (a.date_created > b.date_created) return 1;
            return 0;
          })

        } else if (data === 'alphabetical') {

          this.notes.sort((a, b) => {
            if (a.key.toLowerCase() < b.key.toLowerCase()) return -1;
            if (a.key.toLowerCase() > b.key.toLowerCase()) return 1;
            return 0;
          })
        }
      }
    });
    alert.present();
  }

}
