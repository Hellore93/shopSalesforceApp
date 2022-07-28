import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import Salesforce_Images from '@salesforce/resourceUrl/visaIcon';
import createOrder from '@salesforce/apex/ComunityAvenirHouseOrder.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AvenirHouseOrderAndPayment extends LightningElement {

    @track currentUserName;
    visaIcon = Salesforce_Images;
    @wire(CurrentPageReference) pageRef;
    @track orderList;
    totalPrice;

    connectedCallback() {
        if (sessionStorage.getItem('orderItem')) {
            this.orderList = JSON.parse(sessionStorage.getItem('orderItem'));
            sessionStorage.clear();
            this.getTotalPrice();
        }
    }

    getTotalPrice() {
        let newArray = [];
        const priceArray = this.orderList.forEach(element => newArray.push(element.cost));
        this.totalPrice = newArray.reduce((a, b) => a + b, 0);
    }

    rent() {
        let objToSend = [];
        let newObj = {};
        console.log(this.orderList);
        this.orderList.forEach(function(element) {
            newObj.startDate = new Date(element.startDate);
            newObj.endDate = new Date(element.endDate);
            newObj.cost = element.cost;
            newObj.prod = element.prod;
            objToSend.push(newObj);
            newObj = {};
        })
        console.log(objToSend);
        createOrder({ 'orderObject': objToSend }).then(
            (result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Your rent proccess over with success',
                    variant: 'success',
                    mode: 'dismissable'
                }));
            }).catch((error) => { console.log(error); })
    }

}