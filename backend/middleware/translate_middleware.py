import json
from django.utils.deprecation import MiddlewareMixin
from accounts.utils import translate_text

class TranslateResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response['Content-Type'] == 'application/json':
            try:
                data = json.loads(response.content)

                # target_language = request.user.language_preference if request.user.is_authenticated else 'es'
                if 'message' in data:
                    print("/*/*/*/*/*/*/*/*/*/*")
                    print(data)
                    print("/*/*/*/*/*/*/*/*/*/*")
                    target_language = 'ar'
                    data['message'] = translate_text(data['message'], target_language)

                response.content = json.dumps(data)
            except Exception as e:
                print(f"Translation Middleware Error: {e}")

        return response
