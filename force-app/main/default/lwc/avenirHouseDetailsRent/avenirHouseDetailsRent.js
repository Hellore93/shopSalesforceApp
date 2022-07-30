import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import orderItemListProduct from '@salesforce/apex/ComunityAvenirHouseOrder.orderItemListProduct';


export default class AvenirHouseDetailsRent extends NavigationMixin(LightningElement) {

    @wire(CurrentPageReference) pageRef;
    counter = 1;
    @api clickedObject;
    startDate;
    endDate;
    day = 1;
    costRent;
    price;
    orderList;
    checkAvil;


    connectedCallback() {
        var today = new Date();
        this.startDate = today.toISOString();
        this.endDate = today.toISOString();
        if (this.clickedObject.productDiscountPrice[0]) {
            const arrayOfPrice = []
            this.clickedObject.productDiscountPrice.forEach(element => arrayOfPrice.push(element.UnitPrice));
            this.price = Math.min(...arrayOfPrice);
        } else {
            this.price = this.clickedObject.productStandardPrice.UnitPrice;
        }
        this.costRent = this.day * this.price;
    }

    decrement() {
        const count = this.counter;
        this.counter = count - 1;
        if (this.counter < 1) {
            this.counter = 1;
        }
    }

    increse() {
        const count = this.counter;
        this.counter = count + 1;
        if (this.counter > 9) {
            this.counter = 9;
        }
    }

    getStartDate(event) {
        if (new Date(event.target.value).toISOString() < this.startDate ||
            new Date(event.target.value).toISOString() > this.endDate) {
            this.startDate = new Date().toISOString();
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Start date before today or end date',
                    variant: 'error',
                })
            );
        } else {
            this.startDate = new Date(event.target.value).toISOString();
        }
        this.calculate();
    }

    getEndDate(event) {
        if (new Date(event.target.value).toISOString() < this.startDate) {
            this.endDate = new Date().toISOString();
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'End date before start date',
                    variant: 'error',
                })
            );
        } else {
            this.endDate = new Date(event.target.value).toISOString();
        }
        this.calculate();
    }

    calculate() {
        if (this.startDate && this.endDate) {
            this.day = Math.round(1 + (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 3600 * 24));
            this.costRent = this.day * this.price;
        }
    }

    goToPayment() {
        if (this.startDate && this.endDate && this.costRent) {
            const orderList = [];
            const orderListObj = {
                startDate: new Date(this.startDate).toDateString(),
                endDate: new Date(this.endDate).toDateString(),
                cost: this.costRent,
                prod: this.clickedObject
            }
            orderList.push(orderListObj);
            sessionStorage.setItem('orderItem', JSON.stringify(orderList));
            const config = {
                type: 'standard__webPage',
                attributes: {
                    url: '/order-and-payment/'
                }
            };
            this[NavigationMixin.Navigate](config);
        } else {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Field',
                message: 'To rent this house you should choince start and end date!',
                variant: 'error',
                mode: 'dismissable'
            }));
        }
    }

    checkAvailable() {
        orderItemListProduct({ ProductId: this.pageRef.attributes.recordId }).then(
            (result) => {
                this.checkAvil = result;
                this.checkAvailableMethod();
            }
        ).catch((error) => { console.log(error); })

    }

    checkAvailableMethod() {
        let startDate = new Date(this.startDate);
        let endDate = new Date(this.endDate);
        let overlapObject = []
        this.checkAvil.forEach(element => {
            if (
                (startDate > new Date(element.ServiceDate) && startDate < new Date(element.EndDate)) ||
                (endDate > new Date(element.ServiceDate) && endDate < new Date(element.EndDate)) ||
                (startDate < new Date(element.ServiceDate) && endDate > new Date(element.EndDate))
            ) {
                overlapObject.push(element);
            }

        })
        if (overlapObject.length > 0) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Field',
                message: 'Date from: ' + startDate.toDateString() + ' to ' + endDate.toDateString() + ' is not available!',
                variant: 'error',
                mode: 'dismissable'
            }));
        } else {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Your data is available!',
                variant: 'success',
                mode: 'dismissable'
            }));
        }
    }

}