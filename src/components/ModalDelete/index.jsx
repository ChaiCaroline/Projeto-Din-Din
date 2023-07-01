import './style.css';
import point from '../../assets/Polygon 4.svg'
import api from '../../services/api'
import { React } from 'react';
import { getItem } from '../../utils/storage';
const token = getItem('token');

export default function ModalDelete({ extract, ativedDelete, setAtivedDelete, modaisDelete, indice }) {

    async function deleteAccount(id, indice) {
        try {
            const response = await api.delete(`/transacao/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAtivedDelete(!ativedDelete)
            filterDesatived(indice)
        } catch (error) {
            alert(error)
        }
    }
    function filterDesatived(indice) {
        modaisDelete[indice].className = 'modal-delete visibility'
    }
    return (
        <div className={`modal-delete visibility`}>
            <div className='text'><h4>Apagar item?</h4></div>
            <div className='buttons'>
                <button className='button-yes' onClick={() => deleteAccount(extract, indice)}> Sim </button>
                <img src={point} alt="" />
                <button className='button-no' onClick={() => filterDesatived(indice)}>Não</button>
            </div>
        </div>
    );
}