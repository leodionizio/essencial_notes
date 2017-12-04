import { NotesService } from './../../providers/notes/notes.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
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

  // 0 - data edição
  // 1 - data criação
  // 2 - alfabética
  public typeOrder: number = 0;

  constructor(
    public alertCtrl: AlertController,    
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

  ionViewDidLoad() {
    window.scrollTo(0, 0);
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
      spinner: 'circles',
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

  public viewHome(): void {
    this.navCtrl.setRoot('HomePage');
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