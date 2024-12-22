import json
from django.utils.deprecation import MiddlewareMixin
from accounts.utils import translate_text

class TranslateResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response['Content-Type'] == 'application/json':
            try:
                data = json.loads(response.content)
                if 'message' in data:
                    target_language = request.user.profile.preferred_language or 'en'
                    print("/*/*/*/*/*/*/*/*/*/*")
                    print(data)
                    print("lang: " + target_language)
                    print("/*/*/*/*/*/*/*/*/*/*")
                    data['message'] = translate_text(data['message'], target_language)
                elif 'error' in data:
                    target_language = request.user.profile.preferred_language or 'en'
                    data['message'] = translate_text(data['message'], target_language)
                response.content = json.dumps(data)
            except Exception as e:
                print(f"Translation Middleware Error: {e}")

        return response


