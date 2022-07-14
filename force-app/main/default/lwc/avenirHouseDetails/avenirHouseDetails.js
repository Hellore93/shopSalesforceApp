import { LightningElement, track, wire, api } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import startSearchById from '@salesforce/apex/ComunityAvenirHouseSearcher.startSearchById';

const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseDetails extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    productId;
    @track productObject;

    connectedCallback() {
        registerListener('productDetailId', this.sutUpDetails, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    sutUpDetails(houseListEvent) {
        const newData = houseListEvent;
        this.productId = newData;
        console.log(this.productId);
        if (this.productId) {
            startSearchById({ houseId: this.productId }).then(
                (result) => { this.productObject = result }
            ).catch((error) => { console.log(error); });
        }
    }

    get houseObject() {
        if (this.productObject) {
            return this.productObject;
        }
        return null;
    };

    get imgUrl() {
        if (this.productObject) {
            console.log('działam');
            const id = this.productObject.DisplayUrl;
            return IMGURL + id.slice(id.length - 18);
        }
        return null;
    };
}