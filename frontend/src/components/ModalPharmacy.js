import React, { Component } from 'react';
import { Modal, RadioButtonGroup, RadioButton, Loading, SkeletonText } from 'carbon-components-react';
import '../carbon-components.min.css';
import '../components-styles.css';

var dateFormat = require('dateformat');

class ModalPharmacy extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            visibility: (this.props.visibility)?this.props.visibility:"hidden",
            turnId: (this.props.turnId)?this.props.turnId:"",
            turn:[],
            loading: false,
            pharmacies: [],
            replaceId: "",
            loadingModal: false,
            connectionError: false
        };

        this.closeModal = this.closeModal.bind(this);
        this.showModalReact = this.showModalReact.bind(this);
        this.replacePharmacy = this.replacePharmacy.bind(this);
        this.itemToString = this.itemToString.bind(this);
        this.loadPharmacies = this.loadPharmacies.bind(this);
        this.showPharmacies = this.showPharmacies.bind(this);
        this.handleSelectPharmacy = this.handleSelectPharmacy.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.sortThings = this.sortThings.bind(this);
        this.showNotification = this.showNotification.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visibility: (nextProps.visibility)?nextProps.visibility:"hidden" ,
            turnId: (nextProps.turnId)?nextProps.turnId:""
        });
        if(nextProps.visibility === "visible"){
            this.getDataByTurn(nextProps.turnId);
        }
    }

    componentDidMount() {
        this.loadPharmacies();
    }

    showNotification(){
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

    getDataByTurn(id){
        this.setState({
            loading: true
        });
        fetch(`/db_requests/turn/`+encodeURIComponent(id), {
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
                        turn: json[0], 
                        loading: false,
                        connectionError: false
                    });
                });
            }else{
                this.setState({
                    loading: false,
                    connectionError: true
                });
            }
        });
    }

    closeModal(){
        this.setState({
            visibility:"hidden"
        });
    }

    showModalReact(){
        if(this.state.visibility === "hidden"){
            return false;
        }else{
            return true;
        }
    }

    replacePharmacy(){
        console.log("replacePharmacy");
        this.setState({
            loading: true,
            loadingModal: true
        });
        var new_pharma=this.state.replaceId;
        var id=this.state.turnId;
        fetch('http://wuik.com.ar/services/update-turno-admin-salto.php?token=16acd359cb1e6dced49963ac5dc350ccbccfab7e&farmacia_reemplazo='+encodeURIComponent(new_pharma)+'&id='+encodeURIComponent(id),{
            method: 'GET',
            mode: "no-cors",
            headers: {
                Accept: 'application/json',
            },
        },
        ).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log("turn replaced");
                    this.showNotification();
                    this.setState({
                        visibility: "hidden",
                        loading: false,
                        loadingModal: false,
                        connectionError: false
                    });
                });
            }else{
                this.setState({
                    loading: false,
                    visibility: "hidden",
                    loadingModal: false,
                    connectionError: true
                });
            }
        });

        this.setState({
            turnId: "",
            turn:[],
            replaceId: "",
            loadingModal: false
        });
    }

    loadPharmacies(){
        console.log("loadPharmacies");
        this.setState({
            loadingModal: true
        });

        fetch('/db_requests/pharmacies', {
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
                        visibilityModal: "hidden",
                        loadingModal: false,
                        connectionError: false
                    });
                });
            }else{
                this.setState({
                    loading: false,
                    visibilityModal: "hidden",
                    loadingModal: false,
                    connectionError: true
                });
            }
        });
    }

    sortThings(a, b) {
        if (a.NOMBRE > b.NOMBRE) {
          return 1;
        } else if (a.NOMBRE < b.NOMBRE) {
          return -1;
        } else if (a.NOMBRE === b.NOMBRE) {
          return 0;
        }
      }

    showPharmacies(){
        var row = [];
        let pharmas = this.state.pharmacies;
        pharmas = pharmas.sort(this.sortThings);

        for ( var i = 0; i < pharmas.length; i++ ) {
            var idradio = "idradio" + pharmas[i].ID
            row.push( 
                <RadioButton
                    key={pharmas[i].ID}
                    value={pharmas[i].ID}
                    id={idradio}
                    labelText={pharmas[i].NOMBRE}
                    className="some-class"/>
            );
        }

        return row;
    }

    handleSelectPharmacy(element){
        console.log("replaceId" + element);
        this.setState({
            replaceId: element
        });
    }

    handleUpdate(new_pharma, id){
        console.log("replacePharmacy");
        this.setState({
            loading: true,
            loadingModal: true
        });
        fetch('https://wuik.com.ar/services/update-turno-admin-salto.php?token=16acd359cb1e6dced49963ac5dc350ccbccfab7e&farmacia_reemplazo='+encodeURIComponent(new_pharma)+'&id='+encodeURIComponent(id),{
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        },
        ).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log("turn replaced");
                    this.setState({
                        loading: false,
                        loadingModal: false,
                        connectionError: false
                    });
                    this.props.callbackUpdate(this.state.replaceId, this.state.turnId, true)
                });
            }else{
                this.setState({
                    loading: false,
                    loadingModal: false,
                    connectionError: true
                });
                this.props.callbackUpdate(this.state.replaceId, this.state.turnId, false)
            }
        });
    }

    render() {
        let showModalReact = this.showModalReact();
        let pharmacies = this.showPharmacies();
        if(!this.isEmpty(this.state.turn)){
            var dtFrom = new Date(this.state.turn.TURNO_DESDE);
            var dtTo = new Date(this.state.turn.TURNO_HASTA);
        }
        return (
            <div className='doneModalContainer' style={{visibility: this.state.visibility}}>
                <Modal
                    className="modal-style"
                    open={showModalReact}
                    modalHeading="Change turn"
                    modalLabel={this.state.turnId}
                    primaryButtonText="Save"
                    secondaryButtonText="Close"
                    onRequestClose={this.closeModal}
                    onSecondarySubmit={this.closeModal}
                    onRequestSubmit={()=>this.handleUpdate(this.state.replaceId, this.state.turnId)} >

                    {this.state.loadingModal &&
                        <Loading className="some-class" active={this.state.loadingModal} withOverlay={true} />
                    }
                    {this.state.connectionError &&
                        <div>
                            <SkeletonText style={{width: '100%'}}/>
                            <p>Connection error.</p>
                        </div>
                    }
                    {!this.state.connectionError &&
                        <div>
                            <p className="bx--modal-content__text">
                                Pharmacy:&nbsp;{this.state.turn.FARMACIA}
                            </p>
                            <p className="bx--modal-content__text">
                                From:&nbsp;{dateFormat(dtFrom,"dd-mm-yyyy h:MM:ss TT")}
                            </p>
                            <p className="bx--modal-content__text">
                                To:&nbsp;{dateFormat(dtTo,"dd-mm-yyyy h:MM:ss TT")}
                            </p>
                            <p className="bx--modal-content__text">
                                Replacement Pharmacy:&nbsp;{this.state.turn.FARMACIA_REEMPLAZO}
                            </p>
                            <RadioButtonGroup
                                onChange={(e) => this.handleSelectPharmacy(e)}
                                name="radio-button-group"
                                defaultSelected="default-selected"
                                legend="Group Legend"
                                className="radio-button-group-css">
                                {pharmacies}
                            </RadioButtonGroup>
                        </div>
                    }
                    
                </Modal>
            </div>
        )
    }
}

export default ModalPharmacy;