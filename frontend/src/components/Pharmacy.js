import React, {
    Component
} from 'react';
import { SkeletonText, DataTable, Loading, TableBody, TableData, TableHeader, TableHead, TableRow } from 'carbon-components-react';
import '../carbon-components.min.css';
var dateFormat = require('dateformat');

class Pharmacy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pharmacies: [],
            loading: false,
            connectionError: false
        };

        this.getTodayAndTomorrowPharmacy = this.getTodayAndTomorrowPharmacy.bind(this);
        this.handleData = this.handleData.bind(this);
        this.getPharmaciesRows = this.getPharmaciesRows.bind(this);

    }

    componentDidMount() {
        this.setState({
            loading: true
        });
        var dateFormat = require('dateformat');
        var today = new Date();
        var date2 = new Date();
        var date3 = new Date();
        var date1 = dateFormat(today, "yyyy-mm-d+h:MM:ss")
        date2 = date2.setDate(today.getDate()+1);
        date3 = date3.setDate(today.getDate()+2);
        date2 = dateFormat(date2, "yyyy-mm-d+h:MM:ss");
        date3 = dateFormat(date3, "yyyy-mm-d+h:MM:ss");

        // fetch('/db_requests/today/date=' + formatToday + '/date2=' + formatTomorrow, {
            fetch('/db_requests/today/' + date1 + '/' + date2 + '/' + date3, {
            // mode: 'no-cors',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.setState({
                        pharmacies: json,
                        loading: false,
                        connectionError: false
                    });
                    console.log(json)
                });
            }else{
                this.setState({
                    pharmacies: [],
                    loading: false,
                    connectionError: true
                });
            }
        });

        // this.getTodayAndTomorrowPharmacy();
    }

    getTodayAndTomorrowPharmacy() {
        this.setState({
            loading: true
        });
        fetch(`https://wuik.com.ar/services/farmacia-service_salto.php?token=16acd359cb1e6dced49963ac5dc350ccbccfab7e`)
            .then(resp => resp.json())
            .then(json => this.handleData(json));
    }

    handleData(json) {
        console.log(json);
        this.setState({
            pharmacies: json.farmacias,
            loading: false,
            connectionError: false
        })
    }

    isEmpty(myObject) {
        for (var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }

    getPharmaciesRows() {
        var row = [];
        var today = new Date();
        for ( var i = 0; i < this.state.pharmacies.length; i++ ) {
            var dtFrom = new Date(this.state.pharmacies[i].TURNO_DESDE);
            var dtTo = new Date(this.state.pharmacies[i].TURNO_HASTA);
            var checkToday = (dateFormat(dtFrom, "dd-mm-yyyy") === dateFormat(today, "dd-mm-yyyy") ? true: false);
            console.log(checkToday)
            row.push( 
                <TableRow key={this.state.pharmacies[i].ID + [i]} className = {checkToday === true?"today":""}>
                    <TableData>{this.state.pharmacies[i].NOMBRE}</TableData>
                    <TableData>{dateFormat(dtFrom, "dd-mm-yyyy h:MM:ss TT")}</TableData>
                    <TableData>{dateFormat(dtTo, "dd-mm-yyyy h:MM:ss TT")}</TableData>
                    <TableData>{this.state.pharmacies[i].DIRECCION}</TableData>
                </TableRow> 
            );
        }
        return row;
    }

    render() {
        let pharmaciesRows = this.getPharmaciesRows();
        return(
            <div>
                {this.state.loading &&
                    <Loading className = "some-class"
                    active = {this.state.loading}/>
                } 
                {this.state.connectionError &&
                    <div>
                        <SkeletonText style={{width: '100%'}}/>
                        <p>Connection error.</p>
                    </div>
                }
                {!this.state.connectionError && this.state.pharmacies && this.state.pharmacies.length > 0 &&
                    <DataTable.Table>
                        <TableHead>
                            <TableRow header>
                                <TableHeader>
                                    NAME
                                </TableHeader>
                                <TableHeader>
                                    FROM
                                </TableHeader>
                                <TableHeader>
                                    TO
                                </TableHeader>
                                <TableHeader>
                                    ADDRESS
                                </TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pharmaciesRows}
                        </TableBody>
                    </DataTable.Table>
                }
            </div>
        )};
}

export default Pharmacy;