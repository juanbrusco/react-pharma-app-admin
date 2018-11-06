import React, { Component } from 'react';
import { SkeletonText, DataTable, Loading, TableBody, TableData, TableHeader, TableHead, TableRow } from 'carbon-components-react';
import '../carbon-components.min.css';

class TablePharmacies extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            pharmacies: [],
            loading: false,
            connectionError: false
        };

        this.getPharmaciesRows = this.getPharmaciesRows.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true});
        fetch('/db_requests/pharmacies', {
            // mode: 'no-cors',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        },
        ).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.setState({
                        pharmacies: json, 
                        loading: false,
                        connectionError: false
                    });
                });
            }else{
                this.setState({
                    pharmacies: [], 
                    loading: false,
                    connectionError: true
                });
            }
        });
    }

    getPharmaciesRows() {
        var row = [];

        for ( var i = 0; i < this.state.pharmacies.length; i++ ) {
            row.push( 
                <TableRow key={this.state.pharmacies[i].ID}>
                    <TableData>{this.state.pharmacies[i].ID}</TableData>
                    <TableData>{this.state.pharmacies[i].NOMBRE}</TableData>
                    <TableData>{this.state.pharmacies[i].DIRECCION}</TableData>
                    <TableData>{this.state.pharmacies[i].TELEFONO}</TableData>
                </TableRow> 
            );
        }

        return row;
    }

    render() {
        var pharmaciesRows = this.getPharmaciesRows();
        return (
            <div>
                { this.state.loading &&
                    <Loading className="some-class" active={this.state.loading} />
                }
                {this.state.connectionError &&
                    <div>
                        <SkeletonText style={{width: '100%'}}/>
                        <p>Connection error.</p>
                    </div>
                }
                {!this.state.connectionError &&
                    <DataTable.Table>
                        <TableHead>
                            <TableRow header>
                                <TableHeader>
                                    ID
                                </TableHeader>
                                <TableHeader>
                                    NAME
                                </TableHeader>
                                <TableHeader>
                                    ADDRESS
                                </TableHeader>
                                <TableHeader>
                                    PHONE
                                </TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pharmaciesRows}
                        </TableBody>
                    </DataTable.Table>
                }
            </div>
        );
    }
}

export default TablePharmacies;