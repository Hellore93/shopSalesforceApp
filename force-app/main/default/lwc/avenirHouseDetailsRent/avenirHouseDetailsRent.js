import { LightningElement, api } from 'lwc';

export default class AvenirHouseDetailsRent extends LightningElement {

    counter = 1;
    @api clickedObject;
    startDate;
    endDate;
    day = 1;
    costRent;
    price;


    connectedCallback() {
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
        this.startDate = new Date(event.target.value);
        this.calculate();
    }

    getEndDate(event) {
        this.endDate = new Date(event.target.value);
        this.calculate();
    }

    calculate() {
        if (this.startDate && this.endDate) {
            this.day = 1 + (this.endDate - this.startDate) / (1000 * 3600 * 24);
            this.costRent = this.day * this.price;
        }
    }
}