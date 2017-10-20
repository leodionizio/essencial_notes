export class NotesModel {
    
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public color: string,
        public date_created: string,
        public date_edited: string,
    ) { }
}