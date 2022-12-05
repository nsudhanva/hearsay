from django.http import HttpResponse
from django.template import loader
from .models import NewsVote, NewsArticle, NewsLabel, NewsArticleNewsLabel

def index(request):
    template = loader.get_template('index.html')
    articles = NewsArticle.objects.all()
    news_votes = NewsVote.objects.all()
        
    context = {
        'articles': articles,
        'votes': news_votes,
    }

    if request.method == 'GET':
        
        for i in news_votes:
            print(i.news_label.title)

        return HttpResponse(template.render(context, request))
    elif request.method == 'POST':

        option = request.POST.get('option')
        article_id = request.POST.get('article_id')

        # Get the NewsArticle and NewsLabel objects
        article = NewsArticle.objects.get(id=article_id)
        label = NewsLabel.objects.get(id=option)

        # Create and save the NewsVote object
        vote = NewsVote(news_article=article, news_label=label)
        vote.save()

        # Return an HttpResponse with the payload's content
        return HttpResponse(template.render(context, request))