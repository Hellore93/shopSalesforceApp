import { LightningElement, wire, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getOrder from '@salesforce/apex/ComunityAvenirHouseOrder.getOrder';
import { refreshApex } from '@salesforce/apex';

export default class AvenirHouseOrderHistory extends LightningElement {

    @track orderList;
    emptyList;
    wiredActivities;
    newOrder;

    getDate() {
        getOrder({ userId: userId }).then(
            result => {
                this.orderList = JSON.parse(result);
                this.createNewObject();
            })

    }

    connectedCallback() {
        this.getDate();
    }

    createNewObject() {
        let newOrder = sessionStorage.getItem('orderId');
        sessionStorage.clear();
        this.orderList.forEach(element => {
            element.boolNew = newOrder == element.Id;
        })
    }

}