# Generated by Django 4.1.2 on 2022-12-05 23:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0009_remove_newsarticle_bias'),
    ]

    operations = [
        migrations.AddField(
            model_name='newsarticle',
            name='ml',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
