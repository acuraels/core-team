from src.pydantic_models import Book

ALL_BOOKS_DB = [
    Book(
        isbn=1,
        title="Мастер и Маргарита",
        author="Булгаков",
        description="Сатира на советскую жизнь и мистика, кот Бегемот.",
        image_url="https://avatars.mds.yandex.net/get-mpic/5236458/img_id5739883478692037103.jpeg/orig"
    ),
    Book(
        isbn=2,
        title="Дюна",
        author="Фрэнк Герберт",
        description="Эпическая сага о политике и экологии на пустынной планете Арракис.",
        image_url="https://avatars.mds.yandex.net/get-mpic/6338835/img_id6553528394597678013.jpeg/orig"
    ),
    Book(
        isbn=3,
        title="1984",
        author="Джордж Оруэлл",
        description="Мрачная история о тоталитарном государстве и Большом Брате.",
        image_url="https://avatars.mds.yandex.net/i?id=cda7a914159b1923ad4deddc248dabc8_l-12714984-images-thumbs&n=13"
    ),
    Book(
        isbn=4,
        title="Властелин Колец",
        author="Толкин",
        description="Путешествие хоббитов ради спасения мира от зла.",
        image_url="https://avatars.mds.yandex.net/i?id=3eeac4bd3b4f33077a538cff906fc7a4_l-8338814-images-thumbs&n=13"
    ),
    Book(
        isbn=5,
        title="Зеленая миля",
        author="Стивен Кинг",
        description="История о тюремном блоке смертников и чудесах.",
        image_url="https://static2.my-shop.ru/products185/1840339/cover.jpg"
    ),
    Book(
        isbn=6,
        title="Автостопом по галактике",
        author="Дуглас Адамс",
        description="Абсурдные и смешные приключения в космосе.",
        image_url="https://ir.ozone.ru/s3/multimedia-h/6864009569.jpg"
    ),
    Book(
        isbn=7,
        title="Гарри Поттер и Кубок Огня",
        author="Роулинг",
        description="История о мальчике-волшебнике и школе Хогвартс.",
        image_url="https://i.pinimg.com/originals/8c/9f/38/8c9f38152952440bc9bc5c1a58c8ddc9.jpg"
    ),
    Book(
        isbn=8,
        title="Задача трех тел",
        author="Лю Цысинь",
        description="Контакт с инопланетной цивилизацией и научные загадки.",
        image_url="https://avatars.mds.yandex.net/get-mpic/12511834/2a000001971e57146c31f26cd69db620f10e/orig"
    ),
    Book(
        isbn=9,
        title="Ведьмак: Час Презрения",
        author="Сапковский",
        description="Приключения охотника на чудовищ в жестоком мире.",
        image_url="https://i.playground.ru/p/97dt8n3kQBG34XkZeflcZQ.jpeg"
    ),
    Book(
        isbn=10,
        title="Агата Кристи: Десять негритят",
        author="Агата Кристи",
        description="Классический детектив, где гости умирают один за другим.",
        image_url="https://ir.ozone.ru/multimedia/1025436591.jpg"
    ),
    Book(
        isbn=28,
        title="Игра престолов",
        author="Джордж Мартин",
        description="Фэнтези о борьбе за Железный трон в мире интриг и войн.",
        image_url="https://cdn1.ozone.ru/multimedia/1011406303.jpg"
    )
]