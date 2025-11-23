from aiogram import Router, types, F
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup
from aiogram.filters import Command

router = Router()

registered_users = {}

@router.message(Command("start"))
async def start_handler(message: types.Message):
    user_id = message.from_user.id

    if user_id in registered_users:
        await message.answer(
            "Вы уже зарегистрированы.",
        )
    else:
        keyboard = ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="Поделиться номером телефона", request_contact=True)]
            ],
            resize_keyboard=True,
            one_time_keyboard=True
        )

        await message.answer(
            "📚 *Добро пожаловать в телеграм-бот Единого читательского билета библиотеки №14!* 📚\n\n"
            "Здесь ты можешь:\n"
            "✅ Получать уведомления о мероприятиях\n"
            "✅ Следить за статусом своих книг\n"
            "✅ Быть в курсе всех новостей библиотеки\n\n"
            "Для регистрации, пожалуйста, поделись своим номером телефона ☎️:",
            reply_markup=keyboard,
            parse_mode="Markdown",
        )

# ИСПРАВЛЕНИЕ: Используем F.contact вместо filters=ContentType.CONTACT
@router.message(F.contact)
async def contact_handler(message: types.Message):
    contact = message.contact
    user_id = message.from_user.id

    registered_users[user_id] = contact.phone_number

    library_url = "https://google.com"
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Перейти на сайт библиотеки", url=library_url)]
        ]
    )

    await message.answer(
        f"Регистрация прошла успешно! Ваш номер: {contact.phone_number}",
        reply_markup=keyboard
    )