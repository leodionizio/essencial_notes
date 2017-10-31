import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
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
  public colorNote: string = 'primary';
  private colors: [{ value: string, label: string }] = [
    { value: 'warning', label: 'Amarelo' },
    { value: 'secondary', label: 'Azul' },
    { value: 'dark', label: 'Cinza' },
    { value: 'brown', label: 'Marrom' },
    { value: 'pink', label: 'Rosa' },
    { value: 'purple', label: 'Roxo' },
    { value: 'success', label: 'Verde' },
    { value: 'danger', label: 'Vermelho' }
  ]

  private form: FormGroup;
  private loading: any;
  private date: Date;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public notesService: NotesService,
    public formBuilder: FormBuilder
  ) {
    this.date = new Date();
    this.form = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      content: [''],
      color: [''],
      date_created: [''],
      date_edited: ['']
    })
    this.note = this.navParams.get('note');
    if (this.note) {
      this.note.color ? this.colorNote = this.note.color : this.colorNote = 'primary'
      this.form.patchValue(this.note);
    }
  }

  ionViewDidLoad() { }

  //mostrar radio colors
  public selectColor() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Cor da Nota');

    this.colors.forEach(element => {
      alert.addInput({
        type: 'radio',
        label: element.label,
        value: element.value,
        checked: false
      });
    });


    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.colorNote = data;
        this.form.patchValue({ color: data });
      }
    });
    alert.present();
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

  public salvarNota(): void {
    this.presentLoading('Salvando Nota...');
    if (!this.form.valid) {
      this.loading.dismiss();
      this.presentToast('Digite um título para a nota');
    } else {
      if (!this.form.value.date_created) {
        this.form.patchValue({ date_created: this.date });
      }
      if (!this.form.value.color) {
        this.form.patchValue({ color: 'dark' });
      }
      this.form.patchValue({ date_edited: this.date });
      this.note = new NotesModel(
        this.form.value.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.color,
        this.form.value.date_created,
        this.form.value.date_edited,
      );
      this.notesService.onSave(this.note)
        .then((result: any) => {
          this.loading.dismiss();
          this.navCtrl.pop();
        })
        .catch((error: Error) => {
          this.loading.dismiss();
          this.presentToast('Falha ao criar a nota')
        })
    }
  }

  public deletarNota(): void {
    this.presentLoading('Deletando Nota...');
    if (this.form.value.id) {
      this.notesService.delete(this.note.id)
        .then((result: any) => {
          this.loading.dismiss();
          this.navCtrl.pop();
        })
        .catch((error: Error) => {
          this.loading.dismiss();
          this.presentToast('Falha ao deletar a nota')
        })
    } else {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

}
