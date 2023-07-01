import './style.css';
import Logo from '../../../components/Logo/index'
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { setItem, getItem } from '../../../utils/storage'
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erroNotificacao, setErroNotificacao] = useState(false);
    const [errorText, setErrorText] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = getItem('token');
        if (token) {
            navigate('/main');
        }
    }, [])
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (!email || !password) {
                setErroNotificacao(true);
                setErrorText("Digite um Login é também uma senha")
                return
            }
            const response = await api.post('/login', {
                email: email,
                senha: password
            });
            setErroNotificacao(false);
            setEmail('');
            setPassword('');
            const { token, usuario } = response.data;
            setItem('token', token)
            setItem('id', usuario.id)
            setTimeout(() => {
                navigate('/main');
            }, 100);
        } catch (error) {
            setErroNotificacao(true);
            setErrorText(error.response.data.mensagem)
        }

    }
    return (
        <div className="containerSignin">
            <div className='logoSingin'>
                <div className='logo'>
                    <Logo></Logo>
                </div>
                <div className='logosecundary'>
                </div>
            </div>
            <div className='login'>
                <div className='textFinance'>
                    <h1 >Controle suas <span className='finance'>finanças</span>, sem planilha chata.</h1>
                    <h3 className='textController'>Organizar as suas finanças nunca foi tão fácil, com o DINDIN,
                        você tem tudo num único lugar e em um clique de distância.</h3>
                    <Link to='SignUp'><button className='button-register'>Cadastre - se</button></Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h2>Login</h2>
                        <div className='container-login'>
                            <label><h3>E-mail</h3></label>
                            <input type='text' className={erroNotificacao ? 'error' : ''} name='email'
                                value={email} onChange={(event) => setEmail(event.target.value)}></input>
                            <label><h3>Password</h3></label>
                            <input type='password' className={erroNotificacao ? 'error' : ''} name='password'
                                value={password} onChange={(event) => setPassword(event.target.value)}></input>
                            {erroNotificacao && <span className={erroNotificacao ? 'fault' : ''}>{errorText}</span>}
                        </div>
                        <button >Entrar</button>
                    </div>
                </form>
            </div >
            <div></div>
        </div >
    );
}
export default Signin;
