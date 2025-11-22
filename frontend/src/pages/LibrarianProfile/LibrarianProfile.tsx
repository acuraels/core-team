import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import "./LibrarianProfile.css";

const LibrarianProfile = () => {
    return (
        <>
            <Header />
            <main className='main-container librarian-container'>
                <h1 className='librarian-title'>ЛК библиотекаря</h1>
            </main>
            <Footer />
        </>
    );
};

export default LibrarianProfile;
