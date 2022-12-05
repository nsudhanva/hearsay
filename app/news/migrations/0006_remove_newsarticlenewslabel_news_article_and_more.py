# Generated by Django 4.1.2 on 2022-12-05 15:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0005_newsvote'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='newsarticlenewslabel',
            name='news_article',
        ),
        migrations.RemoveField(
            model_name='newsarticlenewslabel',
            name='news_label',
        ),
        migrations.AddField(
            model_name='newsarticlenewslabel',
            name='news_article',
            field=models.ManyToManyField(to='news.newsarticle'),
        ),
        migrations.AddField(
            model_name='newsarticlenewslabel',
            name='news_label',
            field=models.ManyToManyField(to='news.newslabel'),
        ),
    ]