import './style.css';
import closed from '../../assets/close.svg';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import { useState, useRef } from 'react';
const token = getItem('token');

export default function ModalRegister({ setOpenModalRegister, filters }) {
    const buttonInput = useRef('')
    const buttonOutput = useRef('')
    const [informationApi, setInformationApi] = useState({
        tipo: 'saida',
        descricao: '',
        valor: '',
        data: '',
        categoria_id: 1
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
    async function registerAccount() {
        try {
            const response = await api.post('/transacao',
                {
                    tipo: informationApi.tipo,
                    descricao: informationApi.descricao,
                    valor: (parseFloat(informationApi.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })).replace(/,/g, "").replace(/\./g, ""),
                    data: informationApi.data,
                    categoria_id: informationApi.categoria_id
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            alert(error)
        }

    }
    function handleChangeForm(e) {
        setInformationApi({ ...informationApi, [e.target.name]: e.target.value });
    }
    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='title-modal'>
                    <h1>Adicionar Registro</h1>
                    <img src={closed} onClick={() => setOpenModalRegister(false)}></img>
                </div>
                <div className='button-modal'>
                    <button ref={buttonInput} value='entrada' onClick={() => tradeCor(buttonInput)}>Entrada</button>
                    <button ref={buttonOutput} value='saida' onClick={() => tradeCor(buttonOutput)}>Saída</button>
                </div>
                <div className='form-modal'>
                    <form>
                        <div>
                            <label><h2>Valor</h2></label>
                            <input type='number' name='valor' value={(informationApi.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} onChange={(e) => handleChangeForm(e)} />
                        </div>
                        <div>
                            <label><h2>Categoria</h2></label>
                            <select id='categoria_id' name='categoria_id' onChange={(e) => (handleChangeForm(e))}>
                                <option disabled selected value={informationApi.categoria_id}>Selecione</option>
                                {filters.map((category) =>
                                    <option key={category.id} value={parseInt(category.id)} >{category.descricao}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label><h2>Data</h2></label>
                            <input type="date" name='data' value={informationApi.data} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        <div>
                            <label><h2>Descrição</h2></label>
                            <input type="text" name='descricao' value={informationApi.descricao} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        <button onClick={registerAccount}>Confirmar</button>
                    </form>
                </div>
            </div>

        </div >
    );
}