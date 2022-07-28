import { LightningElement, api } from 'lwc';

export default class AvenirHouseOrderHistorySingleItem extends LightningElement {

    @api singleOrder;
    showModal = false;
    orderId;
    label = 'Show more';

    connectedCallback() {
        this.orderId = this.singleOrder.Id
    }

    showMore() {
        if (this.showModal == false) {
            this.label = 'Hide';
            this.showModal = true;
        } else {
            this.label = 'Show more';
            this.showModal = false;
        }
    }

    get createTime() {
        if (this.singleOrder) {
            return new Date(this.singleOrder.CreatedDate).toDateString();
        }
    }
}