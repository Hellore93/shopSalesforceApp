import { LightningElement, wire } from 'lwc';
import startSearchByName from '@salesforce/apex/ComunityAvenirHouseSearcher.startSearchByName';
import pubsub from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class AvenirHouseSearcher extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    houseList;
    inputTextValue;


    @wire(startSearchByName, { houseName: '$inputTextValue' })
    data({ error, data }) {
        if (data) {
            console.log(data);
            this.houseList = JSON.stringify(data);
            pubsub.fireEvent(this.pageRef, 'eventdetails', this.houseList);
        } else if (error) {
            console.log('Something went wrong:', error);
        }
    };

    sendListToAnotherComponent() {
        pubsub.fireEvent(this.pageRef, 'eventdetails', this.houseList);
    }

    handleEnter(event) {
        if (event.keyCode === 13) {
            this.inputTextValue = this.template.querySelector(".searchInput").value;
        }
    }
}