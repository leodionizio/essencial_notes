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
  public colorNote: string = 'primary';
  public colors: [{ value: string, label: string }] = [
    { value: 'warning', label: 'Amarelo' },
    { value: 'secondary', label: 'Azul' },
    { value: 'dark', label: 'Cinza' },
    { value: 'brown', label: 'Marrom' },
    { value: 'pink', label: 'Rosa' },
    { value: 'purple', label: 'Roxo' },
    { value: 'success', label: 'Verde' },
    { value: 'danger', label: 'Vermelho' }
  ]
  public modalColor: boolean = false;

  private form: FormGroup;
  private loading: any;
  private date: Date;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public notesService: NotesService,
    public formBuilder: FormBuilder
  ) {
    this.date = new Date();
    this.form = this.formBuilder.group({
      id: [''],
      key: [''],
      title: ['', [Validators.required]],
      content: [''],
      color: [''],
      archived: [0],
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
  public selectColor(): void {
    this.modalColor = !this.modalColor;
  }

  public setColor(color): void {
    this.form.patchValue({ color: color.value });
    this.colorNote = color.value;
    this.modalColor = false;
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

  private createNote(): void {
    this.note = new NotesModel(
      this.form.value.id,
      this.form.value.title.charAt(0).toUpperCase(),
      this.form.value.title,
      this.form.value.content,
      this.form.value.color,
      this.form.value.archived,
      this.form.value.date_created,
      this.form.value.date_edited,
    );
  }

  // função para salvar as informações da nota no sqlite
  public saveNote(): void {
    this.presentLoading('Salvando Nota...');
    if (!this.form.valid) {
      this.loading.dismiss();
      this.presentToast('Digite um título para a nota');
    } else {
      if (!this.form.value.date_created) {
        this.form.patchValue({ date_created: this.date });
      }
      if (!this.form.value.color) {
        this.form.patchValue({ color: 'primary' });
      }
      this.form.patchValue({ date_edited: this.date });
      this.createNote();
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

  // função para deletar a nota selecionada
  public deleteNote(): void {
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

  // função para arquivar a nota selecionada
  public archiveNote(): void {
    this.presentLoading('Aguarde...');
    if (this.form.value.id) {
      this.createNote();
      if(this.note.archived === 1) {
        this.note.archived = 0;
      } else {
        this.note.archived = 1;
      }
      this.notesService.update(this.note)
        .then((result: any) => {
          this.loading.dismiss();
          this.navCtrl.pop();
        })
        .catch((error: Error) => {
          this.loading.dismiss();
          this.presentToast('Falha ao arquivar/desarquivar a nota')
        })
    } else {
      this.loading.dismiss();
      this.navCtrl.pop();
    }
  }

}
