import os

from gigachat import GigaChat


class GigaChatService:
    def __init__(self):
        self.api_key = os.getenv("GIGACHAT_API_KEY")

    def chat(self, prompt: str):
        with GigaChat(credentials=self.api_key) as giga:
            response = giga.chat(prompt)
            return response.choices[0].message.content

    # @staticmethod
    # def _get_token(self):
    #     try:
    #         with GigaChat(credentials=self.api_key) as giga:
    #             return giga.get_token()["access_token"]
    #     except Exception as e:
    #         print(f"Ошибка при получении токена GigaChat: {e}")
