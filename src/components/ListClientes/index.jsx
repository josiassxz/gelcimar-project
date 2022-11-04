import React, { useState, useEffect } from 'react';
import '../../App.css';
import MaterialTable from 'material-table'
import * as axios from 'axios';



function App() {

    const url = 'http://localhost:8080/api/clientes';

    const [data, setData] = useState([])
    const columns = [
        { title: "ID", field: "id" },
        { title: "Cliente", field: "cliente" },
        { title: "Deve Sucata", field: "deveKg" },
        { title: "Deve Dinheiro", field: 'deveDinheiro', },
        { title: "Haver Sucata", field: "haverSucata", },
        { title: "Ultima Alteração", field: "ultimaAlteracao", type: "date" },
        { title: "Deve Boleto", field: "deveBoleto", },
    ]




    const getClientes = async () =>{
        try {
            const response = await axios.get(url)
            setData(response.data);

        } catch (error){
            console.log(error);
        }
    }

    const updateClientes = async () =>{
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
                options={{
                    actionsColumnIndex:-1, addRowPosition: "first"
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
