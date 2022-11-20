import React, { useState, useEffect } from 'react';
import '../../App.css';
import MaterialTable, { MTablePagination } from 'material-table'
import * as axios from 'axios';
import { Grid, TablePagination } from "@material-ui/core";




function App() {

    const url = 'http://localhost:8080/api/clientes';

    const [data, setData] = useState([])

    const [dataFiltro, setDataFiltro] = useState([])

    const [totalDeveDinheiro, setTotalDeveDinheiro] = useState(0)
    const [totalDeveSucata, setTotalDeveSucata] = useState(0)
    const [totalHaverSucata, setTotalHaverSucata] = useState(0)

    // let totalDeveDinheiro = 0
    // let totalDeveSucata = 0
    // let totalHaverSucata = 0


    useEffect(() => {
        calculaValores(data);
    }, [data])

    const calculaValores = (valores) => {
        setTotalDeveDinheiro(valores.reduce((sum, data) => {
            return sum + data.deveDinheiro;
        }, 0));

        setTotalDeveSucata(valores.reduce((sum, data) => {
            return sum + data.deveKg;
        }, 0));

        setTotalHaverSucata(valores.reduce((sum, data) => {
            return sum + data.haverSucata;
        }, 0));
    }




    const search = (event) => {
        if (event.length >= 3) {
            let found = data.filter(obj => {
                return obj.rota.toLowerCase() == event.toLowerCase();
            });
            setDataFiltro(found);
            calculaValores(found)
            console.log(found, 'event')
        } else {
            calculaValores(data);
        }

    }










    const columns = [
        { title: "Cliente", field: "cliente", filtering: false },
        { title: "Deve Sucata", field: "deveKg", filtering: false, },
        { title: "Deve Dinheiro", filtering: false, field: 'deveDinheiro', type: "currency", currencySetting: { currencyCode: "BRL", minimumFractionDigits: 0 } },
        { title: "Haver Sucata", field: "haverSucata", filtering: false, },
        // { title: "Deve Boleto", field: "deveBoleto", },
        { title: "Rota", field: "rota", filtering: false },
        {
            title: "Ultima Alteração", filtering: false, field: "ultimaAlteracao", type: "date", editable: false,
            dateSetting: { locale: "pt-BR" },
        },
    ]

    const getClientes = async () => {
        try {
            const response = await axios.get(url)
            setData(response.data);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getClientes();
    }, [])



    return (
        <div className="App">
            <MaterialTable
                title="Lista de CLientes"
                data={data}
                onSearchChange={(event) => {
                    search(event)
                }}
                columns={columns}
                components={{
                    Pagination: (props) => <div>
                        <Grid container style={{ padding: 15, background: '#f5f5f5' }}>
                            <Grid sm={6} item> Total deve sucata: {totalDeveSucata}  | Total deve dinheiro : {totalDeveDinheiro} | Total haver sucata : {totalHaverSucata}</Grid>
                        </Grid>
                        <TablePagination{...props} />
                    </div>
                }}
                options={{
                    actionsColumnIndex: -1, addRowPosition: "first",
                    exportButton: true,
                    sorting: true,
                    search: true,
                    filtering: true,
                    showEmptyDataSourceMessage: "Não há dados para carregar",
                    showFirstLastPageButtons: false



                }}
                editable={{
                    onRowAdd: (newData) => new Promise((resolve, reject) => {
                        //BackEnd call
                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newData)
                        }).then(resp => resp.json())
                            .then(resp => {
                                getClientes()
                                resolve();
                            })
                    }),
                    onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                        //BackEnd call
                        fetch(url + '/' + oldData.id, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newData)
                        }).then(() => {
                            getClientes()
                            resolve();
                        })
                    }),
                    onRowDelete: (oldData) => new Promise((resolve, reject) => {
                        //BackEnd call
                        fetch(url + "/" + oldData.id, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                        }).then(() => {
                            getClientes()
                            resolve();
                        })
                    })
                }}
            />
        </div>
    );
}

export default App;
