from src.pydantic_models import Book

ALL_BOOKS_DB = [
    Book(
        isbn=1,
        title="Мастер и Маргарита",
        author="Булгаков",
        description="Сатира на советскую жизнь и мистика, кот Бегемот.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=2,
        title="Дюна",
        author="Фрэнк Герберт",
        description="Эпическая сага о политике и экологии на пустынной планете Арракис.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=3,
        title="1984",
        author="Джордж Оруэлл",
        description="Мрачная история о тоталитарном государстве и Большом Брате.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=4,
        title="Властелин Колец",
        author="Толкин",
        description="Путешествие хоббитов ради спасения мира от зла.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=5,
        title="Зеленая миля",
        author="Стивен Кинг",
        description="История о тюремном блоке смертников и чудесах.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=6,
        title="Автостопом по галактике",
        author="Дуглас Адамс",
        description="Абсурдные и смешные приключения в космосе.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=7,
        title="Гарри Поттер",
        author="Роулинг",
        description="История о мальчике-волшебнике и школе Хогвартс.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=8,
        title="Задача трех тел",
        author="Лю Цысинь",
        description="Контакт с инопланетной цивилизацией и научные загадки.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=9,
        title="Ведьмак",
        author="Сапковский",
        description="Приключения охотника на чудовищ в жестоком мире.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=10,
        title="Агата Кристи: Десять негритят",
        author="Агата Кристи",
        description="Классический детектив, где гости умирают один за другим.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=11,
        title="Звёздные войны: Ученик джедая",
        author="Дейв Вулвертон",
        description="Приключения молодого Оби-Вана и его путь к становлению джедаем.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=12,
        title="Преступление и наказание",
        author="Фёдор Достоевский",
        description="Психологическая драма о моральных муках и поиске искупления.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=13,
        title="Три товарища",
        author="Эрих Мария Ремарк",
        description="История дружбы, любви и надежды в послевоенной Германии.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
Book(
        isbn=14,
        title="Солярис",
        author="Станислав Лем",
        description="Контакт людей с загадочным океаном, способным материализовать мысли.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=15,
        title="Шерлок Холмс: Собака Баскервилей",
        author="Артур Конан Дойл",
        description="Расследование мистического преступления на туманных болотах.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=16,
        title="Пикник на обочине",
        author="Стругацкие",
        description="Зона, артефакты и сталкеры в мире после загадочного визита инопланетян.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=17,
        title="Атлант расправил плечи",
        author="Айн Рэнд",
        description="Философский роман о роли разума и предпринимательства в обществе.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=18,
        title="Хроники Нарнии",
        author="Клайв Льюис",
        description="Дети попадают в волшебный мир, где идёт борьба добра и зла.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=19,
        title="Имя розы",
        author="Умберто Эко",
        description="Расследование убийств в средневековом монастыре, наполненное философией.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=20,
        title="Моби Дик",
        author="Герман Мелвилл",
        description="Одержимость капитана Ахаба белым китом и борьба с природой.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=21,
        title="Тень горы",
        author="Грегори Дэвид Робертс",
        description="Продолжение приключений Шантарама в мире криминала и духовных поисков.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=22,
        title="Сияние",
        author="Стивен Кинг",
        description="История о писателе, столкнувшемся с ужасами в изолированном отеле.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=23,
        title="Сто лет одиночества",
        author="Габриэль Гарсиа Маркес",
        description="Магический реализм и история рода Буэндиа в городе Макондо.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=24,
        title="Туманность Андромеды",
        author="Иван Ефремов",
        description="Утопическое будущее человечества и космические исследования.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=25,
        title="Хоббит",
        author="Толкин",
        description="Приключения Бильбо Бэггинса в мире Средиземья.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=26,
        title="451 градус по Фаренгейту",
        author="Рэй Брэдбери",
        description="Антиутопия о мире, где книги запрещены и сжигаются.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=27,
        title="О мышах и людях",
        author="Джон Стейнбек",
        description="Драма о дружбе и сложностях жизни работников на ферме.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    ),
    Book(
        isbn=28,
        title="Игра престолов",
        author="Джордж Мартин",
        description="Фэнтези о борьбе за Железный трон в мире интриг и войн.",
        image_url="https://i.pinimg.com/originals/1a/cd/ac/1acdaccc955bfa037e046697342e5077.jpg"
    )
]