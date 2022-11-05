import React, { useState, useEffect } from 'react';
import '../../App.css';
import MaterialTable,{MTablePagination} from 'material-table'
import * as axios from 'axios';
import {Grid, TablePagination} from "@material-ui/core";




function App() {

    const url = 'http://localhost:8080/api/clientes';

    const [data, setData] = useState([])

    let totalDeveDinheiro = data.reduce((sum, data) => {
        return sum + data.deveDinheiro;
    }, 0);

    let totalDeveSucata = data.reduce((sum, data) => {
        return sum + data.deveKg;
    }, 0);

    let totalHaverSucata = data.reduce((sum, data) => {
        return sum + data.haverSucata;
    }, 0);



    const columns = [
        { title: "Cliente", field: "cliente" },
        { title: "Deve Sucata", field: "deveKg" },
        { title: "Deve Dinheiro", field: 'deveDinheiro',},
        { title: "Haver Sucata", field: "haverSucata",},
        // { title: "Deve Boleto", field: "deveBoleto", },
        { title: "Rota", field: "rota", },
        { title: "Ultima Alteração", field:"ultimaAlteracao", type: "date",  disabled: true,
            dateSetting: { locale: "pt-BR" },},
    ]

    const getClientes = async () =>{
        try {
            const response = await axios.get(url)
            setData(response.data);

        } catch (error){
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
                columns={columns}
                components={{
                    Pagination:(props)=><div>
                        <Grid container style={{padding:15,background: '#f5f5f5'}}>
                            <Grid sm={6} item> Total deve sucata: {totalDeveSucata}  | Total deve dinheiro : {totalDeveDinheiro} | Total haver sucata : {totalHaverSucata}</Grid>
                        </Grid>
                        <TablePagination{...props}/>
                    </div>
                }}
                options={{
                    actionsColumnIndex:-1, addRowPosition: "first",
                    exportButton: true
                }}
                editable={{
                     onRowAdd: (newData) => new Promise ((resolve, reject) => {
                        //BackEnd call
                         fetch(url,{
                            method: "POST",
                            headers:{
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newData)
                        }).then(resp=>resp.json())
                            .then(resp=>{getClientes()
                                resolve();
                            })
                    }),
                    onRowUpdate:(newData,oldData) => new Promise((resolve, reject) => {
                        //BackEnd call
                         fetch(url+'/'+oldData.id,{
                            method: "PUT",
                            headers:{
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newData)
                        }).then(()=>{getClientes()
                                resolve();
                            })
                    }),
                    onRowDelete:(oldData)=> new Promise((resolve, reject) => {
                        //BackEnd call
                           fetch(url+"/"+oldData.id,{
                            method: "DELETE",
                            headers:{
                                "Content-Type": "application/json"
                            },
                        }).then(()=>{getClientes()
                                resolve();
                            })
                    })
                }}
            />
        </div>
    );
}

export default App;
