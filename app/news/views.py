from django.http import HttpResponse
from django.template import loader
from .models import NewsArticle

def index(request):
    articles = NewsArticle.objects.all()
    template = loader.get_template('index.html')
    context = {
        'articles': articles,
    }
    return HttpResponse(template.render(context, request))
