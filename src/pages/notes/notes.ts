import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotesModel } from '../../models/notes.model';
import { NotesService } from '../../providers/notes/notes.service';

@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
  public note: NotesModel;
  public notes: NotesModel[];
  private form: FormGroup;
  private loading: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public notesService: NotesService,
    public formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      content: [''],
    })
    this.note = this.navParams.get('note');
    if (this.note) {
      this.form.patchValue(this.note);
    }
  }

  ionViewDidLoad() { }

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

  public voltarInicio(): void {
    this.navCtrl.setRoot('HomePage');
  }

  public salvarNota(): void {
    this.presentLoading('Salvando Nota...');
    if (!this.form.valid) {
      this.loading.dismiss();
      this.presentToast('Digite um título para a nota');
    } else {
      this.note = new NotesModel(
        this.form.value.id,
        this.form.value.title,
        this.form.value.content
      );
      this.notesService.onSave(this.note)
        .then((result: any) => {
          this.loading.dismiss();
          this.navCtrl.setRoot('HomePage');
        })
        .catch((error: Error) => {
          this.loading.dismiss();
          this.presentToast('Falha ao criar a nota')
        })
    }
  }

  public deletarNota(): void {
    this.presentLoading('Deletando Nota...');
    if(this.form.value.id){
      this.notesService.delete(this.note.id)
      .then((result: any) => {
        this.loading.dismiss();
        this.navCtrl.setRoot('HomePage');
      })
      .catch((error: Error) => {
        this.loading.dismiss();
        this.presentToast('Falha ao deletar a nota')
      })
    } else {
      this.loading.dismiss();
      this.navCtrl.setRoot('HomePage');
    }
  }
}
