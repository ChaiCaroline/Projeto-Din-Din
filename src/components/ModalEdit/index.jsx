import './style.css';
import closed from '../../assets/close.svg';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import { useEffect, useState, useRef } from 'react';
const token = getItem('token');

export default function ModalEdit({ setOpenModalEdit, filters, idSelect }) {
    const buttonInput = useRef('')
    const buttonOutput = useRef('')
    const [informationApi, setInformationApi] = useState({
        tipo: 'saida',
        descricao: '',
        valor: '',
        data: '',
        categoria_id: 1,
        categoria_nome: ''
    })

    function tradeCor(parametro) {
        if (parametro === buttonInput) {
            setInformationApi({ ...informationApi, ['tipo']: 'entrada' })
            buttonInput.current.style.background = '#3A9FF1'
            buttonOutput.current.style.background = '#B9B9B9'
        } else {
            setInformationApi({ ...informationApi, ['tipo']: 'saida' })
            buttonOutput.current.style.background = '#FF576B'
            buttonInput.current.style.background = '#B9B9B9'
        }

    }
    async function Transac() {
        try {
            const response = await api.get(`/transacao/${idSelect}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setInformationApi({
                tipo: response.data.tipo,
                descricao: response.data.descricao,
                valor: response.data.valor,
                data: response.data.data,
                categoria_id: response.data.categoria_id,
                categoria_nome: response.data.categoria_nome
            })
            handleButton(response.data.tipo)
        } catch (error) {
            alert(error)
        }

    }
    async function EditAccount() {
        try {
            const response = await api.put(`/transacao/${idSelect}`,
                {
                    descricao: informationApi.descricao,
                    valor: informationApi.valor,
                    data: informationApi.data,
                    categoria_id: informationApi.categoria_id,
                    tipo: informationApi.tipo
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
        } catch (error) {
            alert(error)
        }

    }
    function handleChangeForm(e) {
        setInformationApi({ ...informationApi, [e.target.name]: e.target.value });
    }
    function handleButton(e) {
        if (e == 'entrada') {
            buttonInput.current.style.background = '#3A9FF1'
            buttonOutput.current.style.background = '#B9B9B9'
        } else {
            buttonOutput.current.style.background = '#FF576B'
            buttonInput.current.style.background = '#B9B9B9'
        }
    }
    useEffect(() => {
        Transac()
    }, []);

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='title-modal'>
                    <h1>Editar Registro</h1>
                    <img src={closed} onClick={() => setOpenModalEdit(false)}></img>
                </div>
                <div className='button-modal'>
                    <button ref={buttonInput} value='entrada' onClick={() => tradeCor(buttonInput)}>Entrada</button>
                    <button ref={buttonOutput} value='saida' onClick={() => tradeCor(buttonOutput)}>Saída</button>
                </div>
                <div className='form-modal'>
                    <form>
                        <div>
                            <label><h2>Valor</h2></label>
                            <input type='number' name='valor' value={informationApi.valor} onChange={(e) => handleChangeForm(e)} />
                        </div>
                        <div>
                            <label><h2>Categoria</h2></label>
                            <select id='categoria_id' name='categoria_id' onChange={(e) => (handleChangeForm(e))}>
                                <option value={informationApi.categoria_id} selected>{informationApi.categoria_nome}</option>
                                {filters.map((category) =>
                                    <option key={category.id} value={category.id} >{category.descricao}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label><h2>Data</h2></label>
                            <input type="date" name='data' value={informationApi.data.slice(0, 10)} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        <div>
                            <label><h2>Descrição</h2></label>
                            <input type="text" name='descricao' value={informationApi.descricao} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        <button onClick={EditAccount}>Confirmar</button>
                    </form>
                </div>
            </div>

        </div >
    );
}