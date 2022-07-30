import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AvenirHouseShoppingCartSingleItem extends LightningElement {

    @api singleCacheProduct;
    price;
    quantityValue = 1;
    day = 1;
    costRent;
    startDate;
    endDate;

    connectedCallback() {
        if (this.singleCacheProduct.productDiscountPrice[0]) {
            const arrayOfPrice = []
            this.singleCacheProduct.productDiscountPrice.forEach(element => arrayOfPrice.push(element.UnitPrice));
            this.price = Math.min(...arrayOfPrice);
        } else {
            this.price = this.singleCacheProduct.productStandardPrice.UnitPrice;
        }
        const day = new Date();
        this.startDate = day.toISOString();
        this.endDate = day.toISOString();
        this.costRent = this.price;
        this.changePriceEvent();
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
        this.rentCost();
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

        this.rentCost();
    }

    deleteFromCache(event) {
        const custEvent = new CustomEvent('callpasstoparent', {
            detail: this.singleCacheProduct.product.Id
        });
        this.dispatchEvent(custEvent);
    }

    rentCost() {
        if (this.startDate && this.endDate) {
            this.day = Math.round(1 + (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 3600 * 24));
            this.costRent = this.day * this.price;
            this.changePriceEvent();
        }
    }

    @api
    getPrice() {
        return this.costRent;
    }

    @api
    getObject() {
        const orderListObj = {
            startDate: new Date(this.startDate).toDateString(),
            endDate: new Date(this.endDate).toDateString(),
            cost: this.costRent,
            prod: this.singleCacheProduct
        }
        return orderListObj;
    }

    changePriceEvent() {
        const custEvent = new CustomEvent('changeprice', {
            detail: 'changePrice'
        });
        this.dispatchEvent(custEvent);
    }

    get singleProduct() {
        if (this.singleCacheProduct) {
            const price = [this.price, this.singleCacheProduct.productStandardPrice.UnitPrice]
            this.price = Math.min(...price);
            return this.singleCacheProduct.product;
        }
        return null;
    }
}