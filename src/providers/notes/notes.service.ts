import { SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { NotesModel } from './../../models/notes.model';
import { SqliteConnService } from './../sqlite-conn/sqlite-conn.service';

@Injectable()
export class NotesService {
  private db: SQLiteObject;
  private isFirstCall: boolean = true;

  constructor(
    public sqliteConnService: SqliteConnService
  ) { }

  private getDb(): Promise<SQLiteObject> {
    if (this.isFirstCall) {
      this.isFirstCall = false;

      return this.sqliteConnService.getDb('essencial.db')
        .then((db: SQLiteObject) => {
          this.db = db;
          this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS notes
          (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT
          )
          `, {})
            .then((success) => {
              console.log('Tabela anotação criada com sucesso', success);
            })
            .catch((error) => {
              console.log('Erro ao criar tabela anotação', error);
            })
          return this.db;
        })
    }
    return this.sqliteConnService.getDb();
  }

  public getAll(orderBy?: string): Promise<NotesModel[]> {
    return this.getDb()
      .then((db: SQLiteObject) => {

        return <Promise<NotesModel[]>>this.db.executeSql(`
          SELECT id, title, content
          FROM notes
          ORDER BY id ${orderBy || 'DESC'}
        `, {})
          .then((resultSet) => {
            let list: NotesModel[] = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              list.push(resultSet.rows.item(i));
            }
            return list;
          })
          .catch((error: Error) => console.log('Erro', error))
      })
  }

  public onSave(note: NotesModel): Promise<NotesModel> {
    return this.db.executeSql(`
    SELECT id
    FROM notes
    WHERE id = ?
    `, [note.id])
      .then(resultSet => {
        if (resultSet.rows.item(0)) {
          this.update(note);
        } else {
          this.create(note);
        }
        return resultSet;
      })
      .catch((error: Error) => {
        console.log(`Erro ao criar '${note.title}' anotação!`, error)
        return note;
      });
  }

  public create(note: NotesModel): Promise<NotesModel> {
    return this.db.executeSql(`
        INSERT INTO notes
        (title, content) VALUES (?,?)
      `, [
        note.title,
        note.content
      ])
      .then(resultSet => {
        note.id = resultSet.insertId;
        return note;
      })
      .catch((error: Error) => {
        console.log(`Erro ao criar '${note.title}' anotação!`, error)
        return note;
      });
  }

  public update(note: NotesModel): Promise<boolean> {
    return this.db.executeSql(`
      UPDATE notes SET title = ?, content = ?
      WHERE id=?
      `   , [
        note.title,
        note.content,
        note.id
      ])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => {
        console.log(`Erro ao atualizar anotação!`, error)
        return false
      });
  }

  public delete(id: number): Promise<boolean> {
    console.log(id);
    return this.db.executeSql('DELETE FROM notes WHERE id=?', [id])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => {
        console.log(`Erro ao deletar anotação!`, error)
        return false;
      });
  }

  public getById(id: number): Promise<NotesModel> {
    return this.db.executeSql(`
      SELECT id, title, content FROM notes WHERE id=?
    `, [
        id
      ])
      .then(resultSet => {
        return resultSet.rows.item(0);
      })
      .catch((error: Error) => {
        console.log(`Erro ao encontrar anotação!`, error)
      });
  }
}
