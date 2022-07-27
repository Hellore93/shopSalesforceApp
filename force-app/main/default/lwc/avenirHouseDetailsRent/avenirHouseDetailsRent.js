import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

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
        console.log(JSON.parse(JSON.stringify(this.clickedObject)));
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
        this.startDate = new Date(event.target.value).toISOString();
        this.calculate();
    }

    getEndDate(event) {
        this.endDate = new Date(event.target.value).toISOString();
        this.calculate();
    }

    calculate() {
        if (this.startDate && this.endDate) {
            console.log(new Date(this.endDate) - new Date(this.startDate));
            this.day = 1 + (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 3600 * 24);
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
}