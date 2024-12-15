# Generated by Django 4.2.17 on 2024-12-12 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='has_new_requests',
            new_name='open_chat',
        ),
        migrations.AddField(
            model_name='achievement',
            name='condition_name',
            field=models.CharField(default='', max_length=255),
        ),
    ]
