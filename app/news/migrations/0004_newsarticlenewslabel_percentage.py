# Generated by Django 4.1.2 on 2022-12-04 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0003_newslabel_newsarticlenewslabel'),
    ]

    operations = [
        migrations.AddField(
            model_name='newsarticlenewslabel',
            name='percentage',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]
