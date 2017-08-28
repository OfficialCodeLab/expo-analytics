export class User {
    id: number;
    Email: string;
    FirstName: string;
    LastName: string;
    WeddingDate: Date;
    ReceiveEmails: boolean;
    hasWedding: boolean;
    Favourites: string[];
    PhoneNumber: string;
    scannedItems: number[];

    // Calculated
    fullName: string;
    num_favourites: number;
    num_scans: number;

    constructor(init: any) {
        this.id = init.id;
        this.Email = init.Email;
        this.FirstName = init.FirstName;
        this.LastName = init.LastName;
        this.WeddingDate = init.WeddingDate;
        this.ReceiveEmails = init.ReceiveEmails;
        this.hasWedding = init.hasWedding;
        this.Favourites = init.Favourites;
        this.PhoneNumber = init.PhoneNumber;
        this.scannedItems = init.scannedItems;

        this.fullName = this.FirstName + " " + this.LastName;
        this.num_favourites = this.Favourites.length;
        this.num_scans = this.scannedItems.length;
    }
}
