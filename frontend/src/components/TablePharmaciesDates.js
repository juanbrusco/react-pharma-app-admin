import React, { Component } from 'react';
import { SkeletonText, InlineNotification, DataTable, Loading, TableBody, TableData, TableHeader, TableHead, TableRow, DropdownV2, DropdownItem, Button  } from 'carbon-components-react';
import '../carbon-components.min.css';
import ModalPharmacy from './ModalPharmacy';
import '../components-styles.css';

class TablePharmaciesDates extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            turns: [],
            pharmacies: [],
            month: "00",
            year: "0000",
            loading: false,
            modified: "#dfe3e6",
            original: "",
            replaceId: "",
            replaceName: "",
            visibilityModal: "hidden",
            turnId: "",
            notification: false,
            notificationText: "",
            notificationError: false,
            connectionError: false
        };

        this.getPharmaciesRows = this.getPharmaciesRows.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.itemToString = this.itemToString.bind(this);
        this.loadMonths = this.loadMonths.bind(this);
        this.loadYears = this.loadYears.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.toString = this.toString.bind(this);
        this.searchTurns = this.searchTurns.bind(this);
        this.showModal = this.showModal.bind(this);
        this.callbackUpdate = this.callbackUpdate.bind(this);
    }

    componentDidMount() {
    }

    componenDidUpdate(){
        this.searchTurns();
    }

    isEmpty(myObject) {
        for(var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }

    itemToString (item) {
        if(item != null){
            return item.NOMBRE;
        }else{
            return "Pharmacy";
        }
    }

    toString (item) {
        return item.props.itemText;
    }

    handleYearChange(eventKey){
        this.setState({
            year: eventKey.selectedItem.props.itemText,
            visibilityModal: "hidden"
        });
    }

    handleMonthChange(eventKey){
        this.setState({
            month: eventKey.selectedItem.props.itemText,
            visibilityModal: "hidden"
        });
    }

    getPharmaciesRows() {
        var styleModified = {backgroundColor : this.state.modified};
        var styleOriginal = {backgroundColor : this.state.original};
        var style = styleOriginal;
        var row = [];
        var dateFormat = require('dateformat');

        for ( var i = 0; i < this.state.turns.length; i++ ) {
            if(this.state.turns[i].farmaciaReemplazo != null){
                style = styleModified;
            }else{
                style = styleOriginal;
            }

            var dtFrom = new Date(this.state.turns[i].fechaDesde + "Z");
            var dtTo = new Date(this.state.turns[i].fechaHasta + "Z");

            row.push( 
                <TableRow key={this.state.turns[i].id} style = {style}>
                    <TableData style={{textDecoration: "underline", color: "#5596e6", cursor: "pointer"}} value={this.state.turns[i].id} onClick={(e) => this.showModal(e)}>{this.state.turns[i].id}</TableData>
                    <TableData>{dateFormat(dtFrom,"dd-mm-yyyy")}</TableData>
                    <TableData>{dateFormat(dtTo,"dd-mm-yyyy")}</TableData>
                    <TableData>{this.state.turns[i].farmacia}</TableData>
                    <TableData>{this.state.turns[i].farmaciaReemplazo}</TableData>
                </TableRow> 
            );
        }

        return row;
    }

    loadMonths(){
        var months = [];
        for ( var i = 1; i < 13; i++ ) {
            months.push(<DropdownItem itemText={i.toString()} value={i.toString()} />)
        }
        return months;
    }

    loadYears(){
        var months = [];
        for ( var i = 2018; i < 2050; i++ ) {
            months.push(<DropdownItem itemText={i.toString()} value={i.toString()} />)
        }
        return months;
    }

    searchTurns(){
        this.setState({
            loading: true,
            visibilityModal: "hidden"
        });
        var month = this.state.month;
        if(month.length === 1){
            month = "0"+month;
        }
        var year = this.state.year;
            fetch("https://wuik.com.ar/services/farmacia-admin-service-salto.php?token=16acd359cb1e6dced49963ac5dc350ccbccfab7e&mes="+ month +"&anio="+ year , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        },
        ).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    this.setState({
                        turns: json.turnos,  
                        visibilityModal: "hidden",
                        loading: false,
                        connectionError: false
                    });
                });
            }else{
                this.setState({
                    loading: false,  
                    visibilityModal: "hidden",
                    connectionError: true
                });
            }
        });
    }

    showModal(element){
    console.log(element.target.childNodes[0].data);
        this.setState({
            turnId:element.target.childNodes[0].data,
            visibilityModal: "visible"
        });
    }

    callbackUpdate(new_pharma, id, response){
        console.log("replacePharmacy");
        this.setState({
            loading: true
        });
        // fetch('https://wuik.com.ar/services/update-turno-admin-salto.php?token=16acd359cb1e6dced49963ac5dc350ccbccfab7e&farmacia_reemplazo='+encodeURIComponent(new_pharma)+'&id='+encodeURIComponent(id),{
        //     method: 'GET',
        //     // mode: "no-cors",
        //     headers: {
        //         Accept: 'application/json',
        //     },
        // },
        // ).then(response => {
            if (response === true) {
                // response.json().then(json => {
                    console.log("turn replaced");
                    this.setState({
                        visibilityModal: "hidden",
                        loading: false,
                        notification: true,
                        notificationText: "The turn "+id+" was updated.",
                        connectionError: false
                    });
                    this.searchTurns();
                // });
            }else{
                this.setState({
                    loading: false,
                    visibilityModal: "hidden",
                    notification: true,
                    notificationText: "Problem with turn "+id,
                    connectionError: true
                });
            }
        // });
    }

    render() {
        var pharmaciesRows = this.getPharmaciesRows();
        var months = this.loadMonths();
        var years = this.loadYears();
        return (
            <div>
                { this.state.loading &&
                    <Loading className="some-class" active={this.state.loading} />
                }
                { this.state.notification &&
                    <InlineNotification
                        className="notification-class"
                        title="Turn updated"
                        subtitle={this.state.notificationText}
                        iconDescription="describes the close button"
                        kind="success"
                    />
                }
                { this.state.notificationError &&
                    <InlineNotification
                        className="notification-class"
                        title="Error on update function"
                        subtitle={this.state.notificationText}
                        iconDescription="describes the close button"
                        kind="error"
                    />
                }
                <div style={{width: 300}}>
                    <DropdownV2
                        type="inline"
                        label="Month"
                        items={months}
                        itemToString={this.toString}
                        onChange={this.handleMonthChange}/>
                    <DropdownV2
                        type="inline"
                        label="Year"
                        items={years}
                        itemToString={this.toString}
                        onChange={this.handleYearChange}/>
                    <Button
                        icon="search"
                        iconDescription="Search"
                        onClick={this.searchTurns}
                        className="some-class"
                        style={{float: "left"}}>
                        Search
                    </Button>
                </div>
                {this.state.connectionError &&
                    <div>
                        <SkeletonText style={{width: '100%'}}/>
                        <p>Connection error.</p>
                    </div>
                }
                <DataTable.Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>FROM</TableHeader>
                            <TableHeader>TO</TableHeader>
                            <TableHeader>PHARMACY NAME</TableHeader>
                            <TableHeader>PHARMACY NAME REPLACE</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>{pharmaciesRows}</TableBody>
                </DataTable.Table>
                <ModalPharmacy visibility={this.state.visibilityModal} turnId={this.state.turnId} callbackUpdate={this.callbackUpdate}/>
            </div>
        );
    }
}

export default TablePharmaciesDates;