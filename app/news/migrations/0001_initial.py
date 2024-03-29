# Generated by Django 4.1.2 on 2022-12-02 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NewsArticle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link', models.URLField()),
                ('headline', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=50)),
                ('short_description', models.TextField()),
                ('authors', models.CharField(max_length=100)),
                ('date', models.DateTimeField()),
            ],
        ),
    ]
