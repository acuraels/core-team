import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import "./LoginPage.css";

const LoginPage = () => {
    return (
        <>
            <Header />
            <main className='main-container login-container'>
                <form className='login-form' onSubmit={e => e.preventDefault()}>
                    <h2 className='login-form-header'>Вход в единый читательский билет</h2>
                    <input
                        type="text"
                        className='login-form-input'
                        placeholder='Логин'
                        required
                    />
                    <input
                        type="password"
                        className='login-form-input'
                        placeholder='Пароль'
                        required
                    />
                    <button type="submit" className='login-form-button'>Войти</button>
                </form>
            </main>
            <Footer />
        </>
    );
};

export default LoginPage;
