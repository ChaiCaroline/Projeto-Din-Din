import './style.css'
import api from '../../services/api'
import { React } from 'react';
import { getItem } from '../../utils/storage';
const token = getItem('token');

export default function ModalCategory({ filters, setExtractPerfil }) {
    const appfilter = [];
    const buttons = document.querySelectorAll('button');
    function filterAtived(element) {
        element.currentTarget.classList.toggle('clic')

        if (element.currentTarget.className) {
            appfilter.push(element.currentTarget.value)
        } else if (!element.currentTarget.className) {
            const indiceRemove = appfilter.indexOf(element.currentTarget.value)
            appfilter.splice(indiceRemove, 1)
        }
    }

    async function searchFilter() {
        let url = '/transacao?';
        appfilter.map((element) => {
            url = (url.concat(`filtro[]=${element}&`));
        })
        try {
            const response = await api.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setExtractPerfil(response.data)
            clear();
        } catch (error) {
            alert(error)
        }
    }

    async function clearButton() {
        try {
            const response = await api.get('/transacao',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setExtractPerfil(response.data)
            clear();
        } catch (error) {
            alert(error)
        }
    }

    function clear() {
        buttons.forEach(element => {
            if (element.classList.value == 'clic') {
                element.classList.value = ''
            }
        });
    }

    return (
        <div className='container-filter'>
            <div>
                <h2>Categoria</h2>
            </div>

            <div className='container-filter-category'>
                {filters.map((category) =>
                    <button key={category.id} value={category.descricao} onClick={(element) => filterAtived(element)} ><h3>{category.descricao}</h3></button>

                )}
            </div>
            <div className='button-filter'>
                <button onClick={clearButton}><h4>Limpar Filtros</h4></button>
                <button onClick={searchFilter}><h4>Aplicar Filtros</h4></button>
            </div>

        </div >
    );
}

