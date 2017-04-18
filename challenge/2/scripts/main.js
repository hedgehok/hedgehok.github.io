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

    render : function() {
        return(
            <form className="filter" onSubmit={this.formChanged}>
                Создано с
                <input type="text" ref="dateFrom" onChange={this.formChanged} />
                по
                <input type="text" ref="dateTo" onChange={this.formChanged} />

                <select ref="customer" onChange={this.formChanged}>
                    <option value="all">Все заказчики</option>
                    <option value="customer1">customer1</option>
                    <option value="customer2">customer2</option>
                    <option value="customer3">customer3</option>
                </select>

                <select ref="status" onChange={this.formChanged}>
                    <option value="all">Все статусы</option>
                    <option value="status1">status1</option>
                    <option value="status2">status2</option>
                    <option value="status3">status3</option>
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
        return {
            items: require('./sample-data'),
            allItems: require('./sample-data'),
            sorted: { name: true, date: true, status: true, customer: true }
        }
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

        // status filter
        if (formData.status !== 'all') {
            items = items.filter(item => item.status === formData.status);
        }

        // customer filter
        if (formData.customer !== 'all') {
            items = items.filter(item => item.customer === formData.customer);
        }

        this.setState({ items : items });
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
                <td>{item.status}</td>
                <td>{item.customer}</td>
            </tr>
        )
    },

    render : function() {
        return(
            <div>
                <Filter onFormChange={this.onFormChange} />
                <table>
                    <thead>
                        <tr>
                            <td><a href="#" onClick={this.sortTable} data-sort="name">Название</a></td>
                            <td><a href="#" onClick={this.sortTable} data-sort="date">Дата</a></td>
                            <td><a href="#" onClick={this.sortTable} data-sort="status">Статус</a></td>
                            <td><a href="#" onClick={this.sortTable} data-sort="customer">Заказчик</a></td>
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