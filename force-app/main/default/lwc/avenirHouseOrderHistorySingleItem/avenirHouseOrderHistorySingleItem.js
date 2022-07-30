import { LightningElement, api } from 'lwc';

export default class AvenirHouseOrderHistorySingleItem extends LightningElement {

    @api singleOrder;
    @api showModal = false;
    orderId;
    label = 'Show more';


    connectedCallback() {
        this.orderId = this.singleOrder.Id;
        console.log(this.showModal);
        this.actualShow();
    }

    showMore() {
        if (this.showModal == false) {
            this.label = 'Hide';
            this.showModal = true;
        } else if (this.showModal == true) {
            this.label = 'Show more';
            this.showModal = false;
        }
    }

    actualShow() {
        if (this.showModal == false) {
            this.label = 'Show more';
            this.showModal = false;
        } else if (this.showModal == true) {
            this.label = 'Hide';
            this.showModal = true;
        }
    }

    get createTime() {
        if (this.singleOrder) {
            return new Date(this.singleOrder.CreatedDate).toDateString();
        }
    }

    @api getSingleOrder() {
        return this.singleOrder;
    }
}