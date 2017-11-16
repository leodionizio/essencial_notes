export class NotesModel {
    constructor(
        public id: number,
        public key: string,
        public title: string,
        public content: string,
        public color: string,
        public archived: number,
        public date_created: string,
        public date_edited: string,
    ) { }
}