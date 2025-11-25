# users
INSERT INTO users (id, name, surname, identifier, login, password, role) 
VALUES (gen_random_uuid(), 'Denis', 'Petrov', '874619', 'user123', 'user123', '1')

INSERT INTO users (id, name, surname, identifier, login, password, role) 
VALUES (gen_random_uuid(), 'Glad', 'library', '749284', 'librarian123', 'librarian123', '2')


# ----------------


# books
INSERT INTO class_book (
    id,
    name,
    description,
    published_year,
    author,
    img_path,
    isbn
)
VALUES
(
    gen_random_uuid(),
    'Война и мир',
    'Эпический роман-эпопея о русской жизни в эпоху наполеоновских войн.',
    1869,
    'Лев Толстой',
    'https://www.vokrug.tv/pic/news/a/2/3/9/rsz300x300_a2390300306688749e46f61791d60f13.jpeg',
    '9785170910000'
),
(
    gen_random_uuid(),
    'Мастер и Маргарита',
    'Роман о дьяволе, посетившем Москву, и любви, преодолевающей время.',
    1966,
    'Михаил Булгаков',
    'https://cdn.librarius.md/img/original/master-i-margarita_1718873232.jpg',
    '9785389082462'
),
(
    gen_random_uuid(),
    '1984',
    'Антиутопический роман о тоталитарном режиме и контроле над мыслью.',
    1949,
    'Джордж Оруэлл',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3UPs2-aTczmxITNd9lTFQmWKxcKMQh5Mkbg&s',
    '9785170622958'
),
(
    gen_random_uuid(),
    'Преступление и наказание',
    'Роман Фёдора Достоевского исследует психологию студента Родионa Раскольниковa, совершившего убийство во имя своей теории о «праве на преступление». Автор глубоко раскрывает внутренний конфликт героя, его отчаяние, чувство вины и путь к очищению через страдание. Произведение затрагивает темы нравственного выбора, свободы и искупления.',
    1866,
    'Фёдор Достоевский',
    'https://static1.bgshop.ru/imagehandler.ashx?filename=10936069.jpg&width=550',
    '9785170940618'
),
(
    gen_random_uuid(),
    'Анна Каренина',
    'Один из самых значимых романов мировой литературы. Лев Толстой описывает трагическую историю Анны Карениной, разрывающейся между долгом, общественным мнением и любовью к Вронскому. Параллельно развивается история Константина Левина, чьи поиски смысла жизни создают философское измерение романа. Книга поднимает вопросы семьи, верности, веры и человеческой природы.',
    1877,
    'Лев Толстой',
    'https://upload.wikimedia.org/wikipedia/commons/b/b3/Anna_Karenina_by_H._Manizer.jpg',
    '9785171026786'
),
(
    gen_random_uuid(),
    'Гарри Поттер и философский камень',
    'Первая книга серии Дж. К. Роулинг рассказывает о мальчике-сироте, который узнаёт, что является волшебником. Поступив в Хогвартс, Гарри сталкивается с чудесами, друзьями, врагами и тайной, связанной с тёмным магом Волан-де-Мортом. Эта книга закладывает основы волшебного мира и превращает историю в мировое культурное явление.',
    1997,
    'Джоан Роулинг',
    'https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/27ed5c19-a045-49dd-8624-5f629c5d96e0/600x900',
    '9780747532699'
),
(
    gen_random_uuid(),
    'Унесённые ветром',
    'Роман Маргарет Митчелл описывает судьбу упрямой и сильной Скарлетт О’Хары на фоне Гражданской войны в США. История сочетает драму, романтику и исторические события. Автор мастерски показывает разрушение старого уклада жизни и становление нового, а также эволюцию характера главной героини.',
    1936,
    'Маргарет Митчелл',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzxZcXwRGAfyYZTT8gzBNClnFUMXD3TRTA2Q&s',
    '9781451635621'
),
(
    gen_random_uuid(),
    'Шерлок Холмс: Собака Баскервилей',
    'Один из самых известных детективов Артура Конан Дойла. История о загадочном родовом проклятии Баскервилей и мистическом чудовище, охотящемся на их наследников. Шерлок Холмс и доктор Ватсон распутывают дело, сочетающее логику, атмосферу готики и напряжённый сюжет.',
    1902,
    'Артур Конан Дойл',
    'https://upload.wikimedia.org/wikipedia/ru/thumb/0/05/Sobaka_Baskervilej.jpg/330px-Sobaka_Baskervilej.jpg',
    '9785171063507'
),
(
    gen_random_uuid(),
    'Три мушкетёра',
    'Александр Дюма рассказывает о приключениях д’Артаньяна и его друзей — Атоса, Портоса и Арамиса. На фоне интриг французского двора герои проходят испытания дружбой, честью и любовью. Роман насыщен динамичными сценами, дуэлями, политическими интригами и яркими персонажами.',
    1844,
    'Александр Дюма',
    'data:image/jpeg;base64,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',
    '9785170937069'
),
(
    gen_random_uuid(),
    'Маленький принц',
    'Философская повесть Антуана де Сент-Экзюпери рассказывает историю маленького путешественника с другой планеты. Через простые образы и детскую наивность автор передаёт глубокие мысли о дружбе, любви, ответственности и взрослении. Книга стала символом гуманизма и мудрости.',
    1943,
    'Антуан де Сент-Экзюпери',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZbjnSaNww186IteN2SpFvM1KFK0Ukx-Mzw&s',
    '9780156012195'
),
(
    gen_random_uuid(),
    'Моби Дик',
    'Герман Мелвилл создал эпическую историю о капитане Ахаве, одержимом стремлением уничтожить гигантского белого кита Моби Дика. Роман сочетает приключения, философию и глубокие размышления о судьбе, человеке и природе. Он считается одним из величайших произведений американской литературы.',
    1851,
    'Герман Мелвилл',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW9tbzGJo0PST-MGIrNgDOin_NS2w0SyhjfA&s',
    '9780142437247'
),
(
    gen_random_uuid(),
    'Граф Монте-Кристо',
    'История Эдмона Дантеса, несправедливо осуждённого и заключённого в тюрьму. После побега он находит сокровище и под именем графа Монте-Кристо начинает сложную игру возмездия. Роман исследует темы мести, судьбы, справедливости и прощения.',
    1844,
    'Александр Дюма',
    'https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/74e639a1-19e9-48d4-ab63-5bb8a8de2423/600x900',
    '9785170937052'
),
(
    gen_random_uuid(),
    'Портрет Дориана Грея',
    'Оскар Уайльд создал психологический роман о юноше, сохранившем вечную молодость, в то время как его портрет стареет и отражает грехи. Произведение раскрывает темы наслаждения, морали, соблазна и разрушительного влияния тщеславия. Это классика декаданса и философии.',
    1890,
    'Оскар Уайльд',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTllE13-oKfe01md65Z3R8-xFCMlwymbEtmug&s',
    '9785170901435'
);




# ----------------




# events
INSERT INTO events (
    id,
    name,
    description,
    start_at,
    end_at,
    event_image
)
VALUES
(
    1,
    'Ночь в библиотеке',
    'Ежегодное культурное событие с экскурсиями по редкому фонду, чтениями, мастер-классами и викторинами. Гости смогут попасть в закрытые фонды и увидеть редкие издания, которые обычно недоступны.',
    '2025-02-15 18:00:00+03',
    '2025-02-15 23:00:00+03',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-kLzgclIalIEBwewxPxncKfN1cxd6eRpM8Q&s'
),
(
    2,
    'Литературный вечер: Достоевский',
    'Тематическая встреча, посвящённая биографии и творчеству Фёдора Михайловича Достоевского. Литературовед расскажет об особенностях стиля автора, его влиянии на мировую культуру и малоизвестных фактах жизни.',
    '2025-03-10 19:00:00+03',
    '2025-03-10 21:00:00+03',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmtyTUMdA3gXqJgsvJt2Qm8E-VNBRUsSMvQ&s'
),
(
    3,
    'Мастер-класс: Создание книжных закладок',
    'Творческое занятие для детей и взрослых, где участники смогут создать уникальные закладки из бумаги, ткани и декоративных элементов. Все материалы предоставляются библиотекой.',
    '2025-04-05 14:00:00+03',
    '2025-04-05 16:00:00+03',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJzJWNSF4mUFBKV7MGGphGdOz1fjrUYGiaTw&s'
),
(
    4,
    'Презентация новой книги местного автора',
    'Встреча с современным писателем, который представит свою новую книгу, расскажет о процессе создания и ответит на вопросы гостей. В конце мероприятия — автограф-сессия.',
    '2025-05-12 17:00:00+03',
    '2025-05-12 19:00:00+03',
    'https://avatars.mds.yandex.net/get-altay/1899063/2a0000016ae2fff4ff7f36e581fccba50c13/L_height'
);


# ----------------


# object_book (экземпляры книги - class_book)
insert into object_book (id, class_book_id, status, is_taked)
values
(
1,
'd3a04dd4-364e-4a44-ac05-b4f78e925d6c',
1,
false
);