import { LightningElement, api, wire } from 'lwc';
import pubsub from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseSearcherResultsSingleObject extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @api singleHouseObject;
    clickedElement;

    test() {
        console.log(JSON.stringify(this.singleHouseObject));
    }
    get result() {
        if (this.singleHouseObject) {
            return this.singleHouseObject;
        }
        return null;
    };

    get imgUrl() {
        if (this.result.Id) {
            const id = this.result.DisplayUrl;
            return IMGURL + id.slice(id.length - 18);
        }
    };

    getThisItem(event) {
        pubsub.fireEvent(this.pageRef, 'productDetailId', this.singleHouseObject.Id);
    };
}