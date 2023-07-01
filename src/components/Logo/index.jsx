import './style.css';
import logoWhite from '../../assets/logoWhite.svg';


export default function Logo() {
    return (
        <div className='logo'>
            <img src={logoWhite} alt="" />
            <h1 className='textLogo'>Dindin</h1>
        </div>
    )
}
