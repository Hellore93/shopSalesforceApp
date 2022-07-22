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
        console.log('callback');
        refreshApex(this.wiredActivities);
    }


    getStartDate(event) {
        this.startDate = new Date(event.target.value);
    }

    getEndDate(event) {
        this.endDate = new Date(event.target.value);
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

}