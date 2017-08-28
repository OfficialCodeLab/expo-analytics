import {Pipe, PipeTransform} from '@angular/core';
import {Vendor} from "../classes/vendor";

@Pipe({
    name: 'vendorSearch'
})
export class VendorSearchPipe implements PipeTransform {

    transform(input: Vendor[], search: string): any {
        // console.log(input, search);
        return input.filter(item => {
            let flag = false;
            if (item.name_english.toLowerCase().includes(search.toLowerCase())
                ||  item.category.toLowerCase().includes(search.toLowerCase())
                ||  item.stand_number !== undefined && item.stand_number.toLowerCase().split(" ").join("").includes(search.toLowerCase())) {
                flag = true;
            }
            return flag;
        });
    }

}
