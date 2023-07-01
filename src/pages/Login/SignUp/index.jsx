import './style.css';
import Logo from '../../../components/Logo/index'
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { getItem } from '../../../utils/storage'

function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordAgain: '',
  });
  const [formError, setFormError] = useState({
    nome: true,
    email: true,
    password: true,
    passwordAgain: true
  })
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = getItem('token');

    if (token) {
      navigate('/main');
    }
  }, [])
  async function handleAddUser() {
    try {
      const response = await api.post('/usuario', {
        nome: form.name,
        email: form.email,
        senha: form.password
      });
      setSuccess("Cadastrado Efetuado com sucesso");
      handleClear();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      if (error.response.status >= 400 || error.response.status < 500) {
        setError(error.response.data.mensagem)
      } else {
        setError(error.response.data.mensagem)
      }
    }
  }
  function handleClear() {
    setForm({
      name: '',
      email: '',
      password: '',
      passwordAgain: ''
    })
  }
  function handleChangeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name) {
      return (
        setFormError({ ...formError, ['nome']: false }),
        setError("O nome é obrigatório"))
    }
    if (!form.email) {
      setFormError({ ...formError, ['nome']: true, ['email']: false })
      return (
        setError("O E-mail é obrigatório"))
    };
    if (form.email.indexOf("@") === -1 || form.email.indexOf("@") > form.email.indexOf(".com")) {
      return (
        setError("Insira um e-mail válido"))
    };
    if (!form.password) {
      return (
        setFormError({ ...formError, ['nome']: true, ['email']: true, ['password']: false }),
        setError("O senha é obrigatório"))
    };
    if ([form.password.length] < 4) {
      return (
        setError("A senha precisa ser no mínimo 4 caracteres"))
    }
    if (!form.passwordAgain) {
      return (
        setFormError({ ...formError, ['nome']: true, ['email']: true, ['password']: true, ['passwordAgain']: false }),
        setError("O confirmação de senha é obrigatório"))
    };
    if (form.passwordAgain !== form.password) {
      return (
        setError("As senhas precisam ser iguais"))
    }
    return (
      setFormError({ ...formError, ['nome']: true, ['email']: true, ['password']: true, ['passwordAgain']: true }),
      handleAddUser()
    )
  }
  return (
    <div className="container2">
      <div className='logoSingin'>
        <div className='logo'>
          <Logo></Logo>
        </div>
        <div className='logosecundary'>
        </div>
      </div>
      <div className='modal-signup'>
        <h2>Cadastre - se </h2>
        <form className='formSubmit' onSubmit={handleSubmit}>
          <label htmlFor="name"><h3>Nome</h3></label>
          <input type='text' className={formError.nome ? '' : 'erro'} name='name' value={form.name} onChange={handleChangeForm}></input>
          <label htmlFor="email"><h3>E-mail</h3></label>
          <input type='text' className={formError.email ? '' : 'erro'} name='email' value={form.email} onChange={handleChangeForm}></input>
          <label htmlFor="password"><h3>Senha</h3></label>
          <input type='password' className={formError.password ? '' : 'erro'} name='password' value={form.password} onChange={handleChangeForm}></input>
          <label htmlFor="passwordAgain"><h3>Confirmação de senha</h3></label>
          <input type='password' className={formError.passwordAgain ? '' : 'erro'} name='passwordAgain' value={form.passwordAgain} onChange={handleChangeForm}></input>
          {error && <span className='error-register'>{error}</span>}
          {success && <span className='successpan'>{success}</span>}
          <button type='submit'>Cadastrar</button>
          <h4 className='backHome'><Link to="/">Já tem cadastro? Clique aqui!</Link></h4>
        </form>
      </div>
    </div >
  )
}
export default SignUp;