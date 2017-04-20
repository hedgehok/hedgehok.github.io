var React = require('react');
var ReactDOM = require('react-dom');

/*
    Filter
    <Filter />
*/
var Filter = React.createClass({
    formChanged : function(e) {
        e.preventDefault();

        var formData = {
            dateFrom : this.refs.dateFrom.value,
            dateTo : this.refs.dateTo.value,
            customer : this.refs.customer.value,
            status : this.refs.status.value
        };

        this.props.onFormChange(formData);
    },

    renderOptions : function(item) {
        return (
            <option key={item} value={item}>{item}</option>
        )
    },

    render : function() {
        return(
            <form className="filter" onSubmit={this.formChanged}>
                Создано с
                <input type="text" ref="dateFrom" onChange={this.formChanged} />
                по
                <input type="text" ref="dateTo" onChange={this.formChanged} />

                <select ref="customer" onChange={this.formChanged}>
                    <option value="all">Все заказчики</option>
                    { this.props.customers.map(this.renderOptions) }
                </select>

                <select ref="status" onChange={this.formChanged}>
                    <option value="all">Все статусы</option>
                    { this.props.statuses.map(this.renderOptions) }
                </select>
            </form>
        )
    }
});

/*
    App
    <App />
*/
var App = React.createClass({
    getInitialState : function() {
        var sampleData = require('./sample-data');

        return {
            items: sampleData,
            allItems: sampleData,
            sorted: { name: true, date: true, status: true, customer: true },
            statuses : this.filterStatuses(sampleData, 'status'),
            customers : this.filterStatuses(sampleData, 'customer')
        }
    },

    filterStatuses : function(data, field) {
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
    },

    checkDate : function(val) {
        var val_r = val.split(".");
        var curDate = new Date(val_r[2], val_r[1], val_r[0]);
        return (
            curDate.getFullYear() == val_r[2]
            && curDate.getMonth() == val_r[1]
            && curDate.getDate() == val_r[0]
        );
    },

    onFormChange : function(formData) {
        var items = this.state.allItems;

        // dateFrom filter
        if (this.checkDate(formData.dateFrom)) {
            var dateArr = formData.dateFrom.split(".");
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
        if (this.checkDate(formData.dateTo)) {
            var dateArr = formData.dateTo.split(".");
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

        var customers = this.filterStatuses(items, 'customer');

        // customer filter
        if (formData.customer !== 'all') {
            items = items.filter(item => item.customer === formData.customer);
        }

        var statuses = this.filterStatuses(items, 'status');

        // status filter
        if (formData.status !== 'all') {
            items = items.filter(item => item.status === formData.status);
        }

        this.setState({
            items : items,
            statuses : statuses,
            customers : customers
        });
    },

    sortTable : function(e) {
        e.preventDefault();

        var sortBy = e.target.dataset.sort;
        var Sorted = this.state.sorted;
        var isSorted = Sorted[sortBy];
        var direction = isSorted ? 1 : -1;

        const sortedItems = this.state.items.sort((a, b) => {
            if (a[sortBy] === b[sortBy]) { return 0; }
            return a[sortBy] > b[sortBy] ? direction : direction * -1;
        });

        Sorted[sortBy] = !isSorted;

        this.setState({
            items : sortedItems,
            sorted : Sorted
        });
    },

    renderItem : function(item) {
        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>{item.customer}</td>
                <td>{item.status}</td>
            </tr>
        )
    },

    render : function() {
        return(
            <div>
                <Filter onFormChange={this.onFormChange} customers={this.state.customers} statuses={this.state.statuses} />
                <table>
                    <thead>
                        <tr>
                            <td><a href="#" onClick={this.sortTable} data-sort="name">Название</a></td>
                            <td><a href="#" onClick={this.sortTable} data-sort="date">Дата</a></td>
                            <td><a href="#" onClick={this.sortTable} data-sort="customer">Заказчик</a></td>
                            <td><a href="#" onClick={this.sortTable} data-sort="status">Статус</a></td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.items.map(this.renderItem) }
                    </tbody>
                </table>
            </div>
        )
    }
});

ReactDOM.render(<App />, document.querySelector('#main'));