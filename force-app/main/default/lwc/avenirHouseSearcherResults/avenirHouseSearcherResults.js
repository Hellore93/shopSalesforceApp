import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import startSearch from '@salesforce/apex/ComunityAvenirHouseSearcher.startSearch';
import Salesforce_Images from '@salesforce/resourceUrl/IconAvenir';


export default class AvenirHouseSearcherResults extends LightningElement {
    @track houseList;
    @track firstHouseList;
    @wire(CurrentPageReference) pageRef;
    // productFamily = [];
    comboboxValue = 'Any';
    House;
    Penthouse;
    Island;
    Apartment;


    House = Salesforce_Images + '/Domes.jpg';
    Penthouse = Salesforce_Images + '/HistoricalHomes.jpg';
    Island = Salesforce_Images + '/islnd.jpg';
    Apartment = Salesforce_Images + '/Mansion.jpg';
    Mountain = Salesforce_Images + '/Mountan.jpg';

    connectedCallback() {
        registerListener('eventdetails', this.sutUpDetails, this);
    }

    @wire(startSearch, { houseName: '' })
    data({ error, data }) {
        if (data) {
            this.houseList = data;
            this.firstHouseList = data;
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

    house(event) {
        const listObj = this.template.querySelectorAll('.active');
        const stringId = event.currentTarget.id.slice(0, -3);
        const elementId = stringId + "P";
        if (this.template.querySelector(`.${elementId}`).className.includes('active')) {
            this.template.querySelector(`.${elementId}`).classList.remove('active');
        } else {
            listObj[0] ? listObj[0].classList.remove('active') : null;
            this.template.querySelector(`.${elementId}`).classList.add('active');
        }

        if (this.comboboxValue == stringId) {
            this.comboboxValue = ''
        } else {
            this.comboboxValue = event.currentTarget.id.slice(0, -3);
        }
        this.listFilter();
    }

    listFilter() {
        if (this.comboboxValue != '') {
            const newList = this.firstHouseList.filter(item => item.product.Family == this.comboboxValue);
            this.houseList = newList;
        } else {
            this.houseList = this.firstHouseList;
        }
    }

    get results() {
        if (this.houseList) {
            return this.houseList;
        }
        return null;
    };

    get productFamilyOptions() {
        if (this.productFamily) {
            return [...this.productFamily];
        }
    }

}