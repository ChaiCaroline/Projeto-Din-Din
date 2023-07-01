import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterImg from '../../assets/filterIcon.png';
import Extract from '../../components/Extract';
import Logo from '../../components/Logo';
import ModalCategory from '../../components/ModalCategory';
import ModalEdit from '../../components/ModalEdit';
import ModalEditPerfil from '../../components/ModalEditPerfil';
import ModalRegister from '../../components/ModalRegister';
import api from '../../services/api';
import { clearAll, getItem } from '../../utils/storage';
import './style.css';

export default function Main2() {
    const token = getItem('token');
    const navigate = useNavigate();
    const [openFilter, setOpenFilter] = useState(false);
    const [resumeExtract, setResumeExtract] = useState({
        entrada: '',
        saida: ''
    });
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [filters, setFilters] = useState([]);
    const [user, setUser] = useState([]);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [idSelect, setIdSelect] = useState('');
    const [openModalEditPerfil, setOpenModalEditPerfil] = useState(false);
    const [ativedDelete, setAtivedDelete] = useState(true);
    const [extractPerfil, setExtractPerfil] = useState([]);

    async function ExtractResume() {
        try {
            const response = await api.get('/transacao/extrato', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return setResumeExtract({
                entrada: response.data.entrada,
                saida: response.data.saida
            })
        } catch (error) {
            alert(error)
        }
    }
    function logout() {
        navigate('/');
        clearAll();
    }
    async function perfilResume() {
        try {
            const response = await api.get('/usuario', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data)
        } catch (error) {
            alert(error)
        }
    }
    async function filterCategory() {
        try {
            const response = await api.get('/categoria', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFilters(response.data)
        } catch (error) {

        }

    }
    useEffect(() => {
        filterCategory()
        perfilResume()
        ExtractResume()
    }, []);
    useEffect(() => {
        ExtractResume()
        perfilResume()
    }, [openModalEdit, openModalRegister, ativedDelete]);
    useEffect(() => {
        perfilResume()
    }, [openModalEditPerfil])
    return (
        <>
            <div className='main'>
                {openModalRegister && <ModalRegister
                    setOpenModalRegister={setOpenModalRegister}
                    filters={filters}
                />}
                {openModalEdit && <ModalEdit
                    filters={filters}
                    setOpenModalEdit={setOpenModalEdit}
                    idSelect={idSelect}
                />}
                {openModalEditPerfil && <ModalEditPerfil
                    user={user}
                    setOpenModalEditPerfil={setOpenModalEditPerfil}
                />}
                <div className='header'>
                    <Logo></Logo>
                    <div className='logout-profile'>
                        <div className='profile' onClick={() => setOpenModalEditPerfil(true)} ></div>
                        <div className='name'><h1>{user.nome}</h1></div>
                        <div className='logout' onClick={logout}></div>
                    </div>
                </div>
                <div className="body">
                    <div className='container-main'>
                        <button className='filter2' onClick={() => setOpenFilter(!openFilter)} >
                            <img src={FilterImg}></img>
                            <h4>Filtrar</h4>
                        </button>
                        {openFilter &&
                            <ModalCategory
                                filters={filters}
                                setExtractPerfil={setExtractPerfil}
                            />}
                        <div className='container'>
                            <Extract
                                setOpenModalEdit={setOpenModalEdit}
                                setIdSelect={setIdSelect}
                                setAtivedDelete={setAtivedDelete}
                                ativedDelete={ativedDelete}
                                extractPerfil={extractPerfil}
                                setExtractPerfil={setExtractPerfil}
                            />
                            <div className='container-right'>
                                <div className='container-resume'>
                                    <div ><h1>Resumo</h1></div>
                                    <div className='debit'><h2>Entradas</h2> <h2>{(resumeExtract.entrada / 100).toLocaleString("pt-BR", { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })}</h2></div>
                                    <div className='credit'><h2>Saidas</h2> <h2>{(resumeExtract.saida / 100).toLocaleString("pt-BR", { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })}</h2></div>
                                    <div className='balance'><h1>Saldo</h1> <h2>{((resumeExtract.entrada / 100) - (resumeExtract.saida / 100)).toLocaleString("pt-BR", { style: 'currency', currency: "BRL", minimumFractionDigits: 2 })}</h2></div>
                                </div>
                                <button className='newResgister' onClick={() => setOpenModalRegister(true)} ><h1>Adicionar registro</h1></button>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        </>
    )
}

