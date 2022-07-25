import { LightningElement, wire } from 'lwc';
import getCache from '@salesforce/apex/ComunityAvenirHouseCache.getCache';
import { refreshApex } from '@salesforce/apex';
import removeFromCache from '@salesforce/apex/ComunityAvenirHouseCache.removeFromCache';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AvenirHouseShoppingCart extends LightningElement {

    cacheItem;
    wiredActivities;
    startDate;
    endDate;
    totalPrice = 0;

    @wire(getCache)
    wiredResult(result) {
        this.wiredActivities = result;
        const { data, error } = result;
        if (data) {
            this.cacheItem = [];
            if (data.length != 0) {
                this.cacheItem = data;
            }
        }
        if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    connectedCallback() {
        this.getTotalPrice;
        refreshApex(this.wiredActivities);
    }

    passToParent(event) {
        removeFromCache({ productId: event.detail }).then(
            (result) => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Delete from cart success',
                    variant: 'success',
                    mode: 'dismissable'
                }));
            }).finally(
            () => { refreshApex(this.wiredActivities) }
        ).catch((error) => { console.log(error); });
    }

    changePrice(event) {
        this.getTotalPrice();
    }

    getTotalPrice() {
        let newArray = [];
        const priceArray = this.template.querySelectorAll('c-avenir-house-shopping-cart-single-item').forEach(element => newArray.push(element.getPrice()));
        this.totalPrice = newArray.reduce((a, b) => a + b, 0);
    }

}