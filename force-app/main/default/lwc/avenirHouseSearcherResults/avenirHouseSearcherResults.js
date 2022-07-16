import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import startSearch from '@salesforce/apex/ComunityAvenirHouseSearcher.startSearch';

const IMGURL = '/sfc/servlet.shepherd/version/download/'

export default class AvenirHouseSearcherResults extends LightningElement {
    message;
    // @track listOfHouse;
    @track houseList;
    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('eventdetails', this.sutUpDetails, this);
    }

    @wire(startSearch, { houseName: '' })
    data({ error, data }) {
        if (data) {
            this.houseList = data;
        } else if (error) {
            console.log('Something went wrong:', error);
        }
    };

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    sutUpDetails(houseListEvent) {
        const newData = JSON.parse(houseListEvent);
        this.houseList = newData;
    }

    get results() {
        if (this.houseList) {
            return this.houseList;
        }
        return null;
    };



    testVariable() {
        console.log(this.houseList);
        console.log(typeof this.houseList);
    }
}