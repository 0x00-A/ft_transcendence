# Generated by Django 4.2.14 on 2024-10-22 08:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_user_is_oauth_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Oauth2User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider_id', models.CharField()),
                ('provider_name', models.CharField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
