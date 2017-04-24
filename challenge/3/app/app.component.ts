import { Component } from '@angular/core';

export class Item {
    constructor(
        public id: string,
        public name: string,
        public date: string,
        public status: string,
        public customer: string
    ) {}
}

export class Filter{
    constructor(
        public dateFrom: string,
        public dateTo: string,
        public customer: string,
        public status: string
    ) {}
}

@Component({
    selector: 'main-app',
    template: `<form class="filter">
                    Создано с
                    <input type="text" name="dateFrom" [(ngModel)]="filter.dateFrom" (change)="formChanged()"/>
                    по
                    <input type="text" name="dateTo" [(ngModel)]="filter.dateTo" (change)="formChanged()"/>
    
                    <select name="customer" [(ngModel)]="filter.customer" (change)="formChanged()">
                        <option value="all">Все заказчики</option>
                        <option *ngFor="let customer of customers" [value]="customer">{{customer}}</option>
                    </select>
    
                    <select name="status" [(ngModel)]="filter.status" (change)="formChanged()">
                        <option value="all">Все статусы</option>
                        <option *ngFor="let status of statuses" [value]="status">{{status}}</option>
                    </select>
                </form>
                <table>
                    <thead>
                        <tr>
                            <td><a ng-href="" (click)="sortTable('name')">Название</a></td>
                            <td><a ng-href="" (click)="sortTable('date')">Дата</a></td>
                            <td><a ng-href="" (click)="sortTable('customer')">Заказчик</a></td>
                            <td><a ng-href="" (click)="sortTable('status')">Статус</a></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of items">
                            <td>{{item.name}}</td>
                            <td>{{item.date}}</td>
                            <td>{{item.customer}}</td>
                            <td>{{item.status}}</td>
                        </tr>
                    </tbody>
                </table>`
})
export class AppComponent {
    _allItems : Item[] = [
        { id : '1', name : 'name1', date : '06.10.2016', status : 'status1', customer : 'customer1' },
        { id : '2', name : 'name2', date : '16.10.2016', status : 'status2', customer : 'customer2' },
        { id : '3', name : 'name3', date : '26.10.2016', status : 'status3', customer : 'customer1' },
        { id : '4', name : 'name3', date : '26.10.2016', status : 'status3', customer : 'customer2' },
        { id : '5', name : 'name3', date : '26.10.2016', status : 'status3', customer : 'customer3' },
        { id : '6', name : 'name3', date : '26.10.2016', status : 'status3', customer : 'customer1' },
        { id : '7', name : 'name3', date : '26.10.2016', status : 'status3', customer : 'customer2' }
    ];
    items : Item[] = this._allItems;
    sorted = { name: true, date: true, status: true, customer: true };
    statuses : Array<string> = this.filterStatuses(this.items, 'status');
    customers : Array<string> = this.filterStatuses(this.items, 'customer');
    filter: Filter = new Filter('', '', 'all', 'all');

    filterStatuses(data: Array<Item>, field: string) : Array<string> {
        // Получаем уникальный набор ключей для селектов
        var outputData = data.reduce((total, item) => {
            if (total.indexOf(item[field]) < 0) {
                total.push(item[field]);
            }
            return total;
        }, []);

        // и сортируем по возрастанию
        outputData = outputData.sort((a, b) => {
            if (a === b) { return 0; }
            return a > b;
        });

        return outputData;
    };

    sortTable(sortBy: string): void {
        var Sorted = this.sorted;
        var isSorted = Sorted[sortBy];
        var direction = isSorted ? 1 : -1;

        const sortedItems = this.items.sort((a, b) => {
            if (a[sortBy] === b[sortBy]) { return 0; }
            return a[sortBy] > b[sortBy] ? direction : direction * -1;
        });
        this.sorted[sortBy] = !isSorted;
        this.items = sortedItems;
    };

    checkDate(val: string): boolean {
        var val_r = val.split(".");
        var curDate = new Date(val_r[2], val_r[1], val_r[0]);
        return (
            curDate.getFullYear() == val_r[2]
            && curDate.getMonth() == val_r[1]
            && curDate.getDate() == val_r[0]
        );
    };

    formChanged(): void {
        var items = this._allItems;

        // dateFrom filter
        if (this.checkDate(this.filter.dateFrom)) {
            var dateArr = this.filter.dateFrom.split(".");
            var dateFrom = new Date(dateArr[2], dateArr[1], dateArr[0]);

            items = items.filter(item => {
                if (this.checkDate(item.date)) {
                    var itemDateArr = item.date.split(".");
                    var itemDate = new Date(itemDateArr[2], itemDateArr[1], itemDateArr[0]);
                    return itemDate >= dateFrom;
                } else {
                    return true;
                }
            });
        }

        // dateTo filter
        if (this.checkDate(this.filter.dateTo)) {
            var dateArr = this.filter.dateTo.split(".");
            var dateTo = new Date(dateArr[2], dateArr[1], dateArr[0]);

            items = items.filter(item => {
                if (this.checkDate(item.date)) {
                    var itemDateArr = item.date.split(".");
                    var itemDate = new Date(itemDateArr[2], itemDateArr[1], itemDateArr[0]);
                    return itemDate <= dateTo;
                } else {
                    return true;
                }
            });
        }

        /*
         Тут связка фильтров - первичным является customer
         */

        this.customers = this.filterStatuses(items, 'customer');
        // customer filter
        if (this.filter.customer !== 'all') {
            items = items.filter(item => item.customer === this.filter.customer);
        }

        this.statuses = this.filterStatuses(items, 'status');
        // status filter
        if (this.filter.status !== 'all') {
            items = items.filter(item => item.status === this.filter.status);
        }

        this.items = items;
    };
}