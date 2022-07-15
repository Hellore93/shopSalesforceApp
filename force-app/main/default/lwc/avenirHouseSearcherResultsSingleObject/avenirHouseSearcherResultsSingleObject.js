import { LightningElement, api } from 'lwc';
const IMGURL = '/sfc/servlet.shepherd/version/download/'

export default class AvenirHouseSearcherResultsSingleObject extends LightningElement {

    @api singleHouseObject;

    test() {
        console.log(JSON.stringify(this.singleHouseObject));
    }
    get result() {
        // console.log(this.singleHouseObject);
        if (this.singleHouseObject) {
            return this.singleHouseObject;
        }
        return null;
    };

    get imgUrl() {
        if (this.result.Id) {
            const id = this.result.DisplayUrl;
            console.log(id);
            console.log(id.slice(id.length - 18));
            console.log(IMGURL + id.slice(id.length - 18));
            return IMGURL + id.slice(id.length - 18);
        }
    };
}