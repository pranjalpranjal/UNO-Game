# Generated by Django 3.1.2 on 2020-10-14 11:49

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('botGame', '0002_auto_20201014_1103'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='BotModel',
            new_name='Bot',
        ),
    ]
