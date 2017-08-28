export class Vendor {
    id: number;
    image_square: string;
    image_landscape: string;
    description_long: string;
    description_short: string;
    stand_number: string;
    name_key: string;
    name_english: string;
    email_address: string;
    website_address: string;
    contact_cell: string;
    contact_landline: string;
    category: string;

    total_scans: number;
    total_favourites: number;

    constructor(init: any) {
        this.id = init.id;
        this.image_square = init.image_square;
        this.image_landscape = init.image_landscape;
        this.description_long = init.description_long;
        this.description_short = init.description_short;
        this.stand_number = init.stand_number;
        this.name_key = init.name_key;
        this.name_english = init.name_english;
        this.email_address = init.email_address;
        this.website_address = init.website_address;
        this.contact_cell = init.contact_cell;
        this.contact_landline = init.contact_landline;
        this.category = init.category;
    }
}
