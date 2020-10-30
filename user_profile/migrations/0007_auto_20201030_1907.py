# Generated by Django 3.1.2 on 2020-10-30 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0006_auto_20201027_1305'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='is_league_changed',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Is League Upgraded'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='current_league',
            field=models.CharField(choices=[('Noobie', 'noobie'), ('Amateur', 'amateur'), ('Expert', 'expert'), ('Champion', 'champion'), ('Super Natural', 'super natural'), ('Universe Boss', 'universe boss'), ('OP', 'op')], default='Noobie', max_length=255, verbose_name='Current League'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='current_rating',
            field=models.IntegerField(default=500, verbose_name='Current Rating'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='maximum_league',
            field=models.CharField(choices=[('Noobie', 'noobie'), ('Amateur', 'amateur'), ('Expert', 'expert'), ('Champion', 'champion'), ('Super Natural', 'super natural'), ('Universe Boss', 'universe boss'), ('OP', 'op')], default='Noobie', max_length=255, verbose_name='Maximum League'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='maximum_rating',
            field=models.IntegerField(default=500, verbose_name='Maximum Rating'),
        ),
    ]
