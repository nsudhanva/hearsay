# Generated by Django 4.1.2 on 2022-12-05 00:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0004_newsarticlenewslabel_percentage'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewsVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('news_article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news.newsarticle')),
                ('news_label', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='news.newslabel')),
            ],
        ),
    ]
