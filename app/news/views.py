from django.http import HttpResponse, JsonResponse
from django.template import loader
from .models import NewsVote, NewsArticle, NewsLabel, NewsArticleNewsLabel
import pandas as pd
import json

def index(request):
    template = loader.get_template('index.html')
    articles = NewsArticle.objects.all()
    news_votes = NewsVote.objects.values()
    print(news_votes)
    news_votes_df = pd.DataFrame(list(news_votes))
        
    context = {
        'articles': articles,
        'votes': '',
    }

    if request.method == 'GET':
        # df_grouped = news_votes_df.groupby(['news_article_id', 'news_label_id']).count()

        # df_grouped = df_grouped.groupby(level=0).apply(lambda x: 100 * x / float(x.sum()))

        # print(df_grouped)

        # context['votes'] = df_grouped.to_frame().reset_index().to_json()

        return HttpResponse(template.render(context, request))
    elif request.method == 'POST':

        option = request.POST.get('option')
        article_id = request.POST.get('article_id')

        # Get the NewsArticle and NewsLabel objects
        article = NewsArticle.objects.get(id=article_id)
        
        label = NewsLabel.objects.get(id=option)

        labels = ['liberal', 'conservative' ,'socialist', 'autocratic']

        print(labels[label.id - 1])
        
        if labels[label.id - 1] == 'liberal':
            article.liberal = str(int(article.liberal) + 1)
        elif labels[label.id - 1] == 'conservative':
            article.conservative = str(int(article.conservative) + 1)
        elif labels[label.id - 1] == 'socialist':
            article.socialist = str(int(article.socialist) + 1)
        elif labels[label.id - 1] == 'autocratic':
            article.autocratic = str(int(article.autocratic) + 1)
        article.save()

        # Create and save the NewsVote object
        vote = NewsVote(news_article=article, news_label=label)
        vote.save()

        # Return an HttpResponse with the payload's content
        return HttpResponse(template.render(context, request))

import pickle

def ml(request):

    print(request.GET.get('text'))

    if request.method == 'GET':

        with open('sentiment_model.pkl', 'rb') as file:
            model = pickle.load(file)

            example_text = [request.GET.get('text')]
            example_result = model.predict(example_text)

            result = {}
            result['text'] = example_text
            result['label'] = list(example_result)[0]

            print(result)

        return HttpResponse(json.dumps(result), content_type='application/json')
