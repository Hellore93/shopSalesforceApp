import { LightningElement, wire, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getOrder from '@salesforce/apex/ComunityAvenirHouseOrder.getOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class AvenirHouseOrderHistory extends LightningElement {

    @track orderList;
    emptyList;
    wiredActivities;

    @wire(getOrder, { userId: userId })
    wiredResult(result) {
        this.wiredActivities = result;
        const { data, error } = result;
        if (data) {
            this.orderList = data;
            data.length == 0 ? this.emptyList = true : this.emptyList = false;
        }
        if (error) {
            console.log(error);
        }
    }

    connectedCallback() {
        refreshApex(this.wiredActivities);
    }
}