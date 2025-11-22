import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import "./ReaderProfile.css";

const ReaderProfile = () => {
    return (
        <>
            <Header />
            <main className='main-container librarian-container'>
                <h1 className='librarian-title'>ЛК читателя</h1>
            </main>
            <Footer />
        </>
    );
};

export default ReaderProfile;
