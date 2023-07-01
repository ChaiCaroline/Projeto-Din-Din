import './style.css';
import closed from '../../assets/close.svg';
import api from '../../services/api';
import { getItem } from '../../utils/storage';
import { useState } from 'react';
const token = getItem('token');

export default function ModalEditPerfil({ setOpenModalEditPerfil, user }) {
    const [perfilUser, setPerfiUser] = useState({
        nome: user.nome,
        email: user.email,
        senha: '',
        senhaConfirmar: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function EditPerfilUser() {
        try {
            const response = await api.put(`/usuario/`, {
                nome: perfilUser.nome,
                email: perfilUser.email,
                senha: perfilUser.senha
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess("Cadastrado Alterado com sucesso");
            setTimeout(() => {
                setOpenModalEditPerfil(false)
            }, 1000);
        } catch (error) {
            setError(error.response.data.mensagem)
        }
    }

    function handleChangeForm(e) {
        setPerfiUser({ ...perfilUser, [e.target.name]: e.target.value });
    }

    function submitEditPerfil(event) {
        event.preventDefault();
        if (!perfilUser.senha) {
            return (
                setError("Preencha campos de senhas"))
        }
        if (perfilUser.senha !== perfilUser.senhaConfirmar) {
            return (
                setError("Senhas precisam ser iguais"))
        }
        setError('')
        return (EditPerfilUser())
    }

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='title-modal'>
                    <h1>Editar Perfil</h1>
                    <img src={closed} onClick={() => setOpenModalEditPerfil(false)}></img>
                </div>
                <div className='form-modal'>
                    <form onSubmit={submitEditPerfil}>
                        <div>
                            <label><h2>nome</h2></label>
                            <input className={success === '' ? '' : 'successEdit'} type='text' name='nome' value={perfilUser.nome} onChange={(e) => handleChangeForm(e)} />
                        </div>
                        <div>
                            <label><h2>E-mail</h2></label>
                            <input className={success === '' ? '' : 'successEdit'} type="text" name='email' value={perfilUser.email} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        <div>
                            <label><h2>Senha</h2></label>
                            <input className={success === '' ? '' : 'successEdit'} type="password" name='senha' value={perfilUser.senha} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        <div>
                            <label><h2>Confirmação de Senha</h2></label>
                            <input className={success === '' ? '' : 'successEdit'} type="password" name='senhaConfirmar' value={perfilUser.senhaConfirmar} onChange={(e) => (handleChangeForm(e))} />
                        </div>
                        {error && <span className='errorSpan'>{error}</span>}
                        {success && <span className='succesSpan'>{success}</span>}
                        <button>Confirmar</button>
                    </form>
                </div>
            </div>
        </div >
    );
}