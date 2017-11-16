import { NotesService } from './../../providers/notes/notes.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { NotesModel } from '../../models/notes.model';

@IonicPage()
@Component({
  selector: 'page-archived',
  templateUrl: 'archived.html',
})
export class ArchivedPage {

  public notes: NotesModel[] = [];
  public allNotes: NotesModel[] = [];
  private loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public notesService: NotesService
  ) { }

  ionViewWillEnter() {
    this.notes = [];
    this.getNotes();
  }

  // toast message
  public presentToast(message: string): void {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'bottom',
      dismissOnPageChange: true,
      duration: 3000
    });
    toast.present();
  }

  // exibir loading
  public presentLoading(message: string): void {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  private getNotes(): void {
    // this.notes = [
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'primary', content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'secondary', content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'warning', content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'dark', content: 'aniotação teste', date_created: '', date_edited: '' },
    //   { id: 1, key: 'A', title: 'Alguma coisa', color: 'purple', content: 'aniotação teste', date_created: '', date_edited: '' },
    // ]
    this.notesService.getAll(1)
      .then((notes: NotesModel[]) => {
        notes.forEach(element => {
          this.notes.push(element);
          this.allNotes.push(element);
        })
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

  public viewNote(note: NotesModel): void {
    this.navCtrl.push('NotesPage', { note });
  }

}