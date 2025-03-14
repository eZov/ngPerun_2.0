import { Person } from "../model/person.model";

export class PersonUnion extends Person {
     constructor(
        public ImePrezime: string,        
        public RadnoMjesto: string,
        public OrgJed?: string,
        public BrojProtokola?: string,
        public Uposlenik?: number
        ) {
            super()
        }
}
