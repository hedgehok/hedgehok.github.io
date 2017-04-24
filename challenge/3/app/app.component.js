"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var Item = (function () {
    function Item(id, name, date, status, customer) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.status = status;
        this.customer = customer;
    }
    return Item;
}());
exports.Item = Item;
var Filter = (function () {
    function Filter(dateFrom, dateTo, customer, status) {
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.customer = customer;
        this.status = status;
    }
    return Filter;
}());
exports.Filter = Filter;
var AppComponent = (function () {
    function AppComponent() {
        this._allItems = [
            { id: '1', name: 'name1', date: '06.10.2016', status: 'status1', customer: 'customer1' },
            { id: '2', name: 'name2', date: '16.10.2016', status: 'status2', customer: 'customer2' },
            { id: '3', name: 'name3', date: '26.10.2016', status: 'status3', customer: 'customer1' },
            { id: '4', name: 'name3', date: '26.10.2016', status: 'status3', customer: 'customer2' },
            { id: '5', name: 'name3', date: '26.10.2016', status: 'status3', customer: 'customer3' },
            { id: '6', name: 'name3', date: '26.10.2016', status: 'status3', customer: 'customer1' },
            { id: '7', name: 'name3', date: '26.10.2016', status: 'status3', customer: 'customer2' }
        ];
        this.items = this._allItems;
        this.sorted = { name: true, date: true, status: true, customer: true };
        this.statuses = this.filterStatuses(this.items, 'status');
        this.customers = this.filterStatuses(this.items, 'customer');
        this.filter = new Filter('', '', 'all', 'all');
    }
    AppComponent.prototype.filterStatuses = function (data, field) {
        // Получаем уникальный набор ключей для селектов
        var outputData = data.reduce(function (total, item) {
            if (total.indexOf(item[field]) < 0) {
                total.push(item[field]);
            }
            return total;
        }, []);
        // и сортируем по возрастанию
        outputData = outputData.sort(function (a, b) {
            if (a === b) {
                return 0;
            }
            return a > b;
        });
        return outputData;
    };
    ;
    AppComponent.prototype.sortTable = function (sortBy) {
        var Sorted = this.sorted;
        var isSorted = Sorted[sortBy];
        var direction = isSorted ? 1 : -1;
        var sortedItems = this.items.sort(function (a, b) {
            if (a[sortBy] === b[sortBy]) {
                return 0;
            }
            return a[sortBy] > b[sortBy] ? direction : direction * -1;
        });
        this.sorted[sortBy] = !isSorted;
        this.items = sortedItems;
    };
    ;
    AppComponent.prototype.checkDate = function (val) {
        var val_r = val.split(".");
        var curDate = new Date(val_r[2], val_r[1], val_r[0]);
        return (curDate.getFullYear() == val_r[2]
            && curDate.getMonth() == val_r[1]
            && curDate.getDate() == val_r[0]);
    };
    ;
    AppComponent.prototype.formChanged = function () {
        var _this = this;
        var items = this._allItems;
        // dateFrom filter
        if (this.checkDate(this.filter.dateFrom)) {
            var dateArr = this.filter.dateFrom.split(".");
            var dateFrom = new Date(dateArr[2], dateArr[1], dateArr[0]);
            items = items.filter(function (item) {
                if (_this.checkDate(item.date)) {
                    var itemDateArr = item.date.split(".");
                    var itemDate = new Date(itemDateArr[2], itemDateArr[1], itemDateArr[0]);
                    return itemDate >= dateFrom;
                }
                else {
                    return true;
                }
            });
        }
        // dateTo filter
        if (this.checkDate(this.filter.dateTo)) {
            var dateArr = this.filter.dateTo.split(".");
            var dateTo = new Date(dateArr[2], dateArr[1], dateArr[0]);
            items = items.filter(function (item) {
                if (_this.checkDate(item.date)) {
                    var itemDateArr = item.date.split(".");
                    var itemDate = new Date(itemDateArr[2], itemDateArr[1], itemDateArr[0]);
                    return itemDate <= dateTo;
                }
                else {
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
            items = items.filter(function (item) { return item.customer === _this.filter.customer; });
        }
        this.statuses = this.filterStatuses(items, 'status');
        // status filter
        if (this.filter.status !== 'all') {
            items = items.filter(function (item) { return item.status === _this.filter.status; });
        }
        this.items = items;
    };
    ;
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'main-app',
        template: "<form class=\"filter\">\n                    \u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441\n                    <input type=\"text\" name=\"dateFrom\" [(ngModel)]=\"filter.dateFrom\" (change)=\"formChanged()\"/>\n                    \u043F\u043E\n                    <input type=\"text\" name=\"dateTo\" [(ngModel)]=\"filter.dateTo\" (change)=\"formChanged()\"/>\n    \n                    <select name=\"customer\" [(ngModel)]=\"filter.customer\" (change)=\"formChanged()\">\n                        <option value=\"all\">\u0412\u0441\u0435 \u0437\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u0438</option>\n                        <option *ngFor=\"let customer of customers\" [value]=\"customer\">{{customer}}</option>\n                    </select>\n    \n                    <select name=\"status\" [(ngModel)]=\"filter.status\" (change)=\"formChanged()\">\n                        <option value=\"all\">\u0412\u0441\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u044B</option>\n                        <option *ngFor=\"let status of statuses\" [value]=\"status\">{{status}}</option>\n                    </select>\n                </form>\n                <table>\n                    <thead>\n                        <tr>\n                            <td><a ng-href=\"\" (click)=\"sortTable('name')\">\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</a></td>\n                            <td><a ng-href=\"\" (click)=\"sortTable('date')\">\u0414\u0430\u0442\u0430</a></td>\n                            <td><a ng-href=\"\" (click)=\"sortTable('customer')\">\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A</a></td>\n                            <td><a ng-href=\"\" (click)=\"sortTable('status')\">\u0421\u0442\u0430\u0442\u0443\u0441</a></td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr *ngFor=\"let item of items\">\n                            <td>{{item.name}}</td>\n                            <td>{{item.date}}</td>\n                            <td>{{item.customer}}</td>\n                            <td>{{item.status}}</td>\n                        </tr>\n                    </tbody>\n                </table>"
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map