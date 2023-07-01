import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import ModalDelete from '../../components/ModalDelete';
import Rubber from '../../assets/delete.png';
import Pen from '../../assets/edit.png';
import FilterDate from '../../assets/iconData.png';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import './style.css';

export default function Extract({ setOpenModalEdit, setIdSelect, ativedDelete, setAtivedDelete, extractPerfil, setExtractPerfil }) {
    const token = getItem('token');
    const [decrescenteAtived, setDecrescenteAtived] = useState(false);
    const modaisDelete = document.querySelectorAll('.modal-delete');

    async function Extract() {
        try {
            const response = await api.get('/transacao/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setExtractPerfil(response.data)
        } catch (error) {
            alert(error)
        }
    }
    function newDate(data) {
        const data1 = new Date(data)
        const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const diaDaSemana = diasDaSemana[data1.getUTCDay()];
        return diaDaSemana
    }
    function onClickPen(id) {
        return (
            setOpenModalEdit(true),
            setIdSelect(id)
        )
    }
    function onclickDate() {
        setDecrescenteAtived(!decrescenteAtived)
        orderDate()
    }
    function orderDate() {
        if (decrescenteAtived) {
            const decrescente = extractPerfil.sort(function (a, b) {
                return (new Date(b.data)) - (new Date(a.data))
            })
            setExtractPerfil(decrescente)
        } else if (!decrescenteAtived) {
            const crescente = extractPerfil.sort(function (a, b) {
                return (new Date(a.data)) - (new Date(b.data))
            })
            setExtractPerfil(crescente)
        }
    }
    function filterAtived(indice) {
        modaisDelete[indice].className = 'modal-delete'
    }
    useEffect(() => {
        Extract();
    }, [setOpenModalEdit, ativedDelete]);

    useEffect(() => {
        Extract();
    }, []);

    return (
        <div className='container-content'>
            <table >
                <thead>
                    <tr >
                        <th className='date' onClick={(event) => event.currentTarget.classList.toggle('ative')}>
                            <h4>Data</h4>
                            <img src={FilterDate} onClick={onclickDate} alt='filtrar-data'></img>
                        </th>
                        <th ><h4>Dia de Semana</h4></th>
                        <th ><h4>Descrição</h4></th>
                        <th ><h4>Categoria</h4></th>
                        <th ><h4>Valor</h4></th>
                        <th ></th>
                    </tr>
                </thead>
                <tbody>
                    {extractPerfil.map((extract, indice) => {
                        return (
                            <tr key={extract.id}>
                                <td><h4>{`${extract.data.slice(8, 10)}/${extract.data.slice(5, 7)}/${extract.data.slice(0, 4)}`}</h4></td>
                                <td><h4>{newDate(extract.data)}</h4></td>
                                <td><h4>{extract.descricao}</h4></td>
                                <td><h4>{extract.categoria_nome}</h4></td>
                                <td><h4 style={{ color: extract.tipo === 'entrada' ? '#7B61FF' : '#FA8C10' }}>{(extract.valor / 100).toLocaleString("pt-BR", { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })}</h4></td>
                                <td className='icons' key={extract.id}>
                                    <img src={Pen} onClick={() => onClickPen(extract.id)} alt='editar'></img>
                                    <img className='rubber' src={Rubber} onClick={() => filterAtived(indice)} alt='excluir'></img>
                                    <ModalDelete
                                        extract={extract.id}
                                        ativedDelete={ativedDelete}
                                        setAtivedDelete={setAtivedDelete}
                                        indice={indice}
                                        modaisDelete={modaisDelete}
                                    />
                                </td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>

        </div >
    );
}