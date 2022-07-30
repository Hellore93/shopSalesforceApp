import { LightningElement, api } from 'lwc';
import orderItemList from '@salesforce/apex/ComunityAvenirHouseOrder.orderItemList';

export default class AvenirHouseOrderHistorySingleItemModal extends LightningElement {

    @api showModal;
    @api orderId;
    orderItems;

    closeModal(event) {
        this.showModal = false;
        const custEvent = new CustomEvent(
            'callpasstoparent', {
                detail: false
            });
        this.dispatchEvent(custEvent);
    }

    connectedCallback() {
        orderItemList({ OrderId: this.orderId })
            .then((result) => {
                this.orderItems = result;
            })
            .catch(error => {
                console.log(error);
            });
    }

}