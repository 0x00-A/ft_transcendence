# Generated by Django 4.2.16 on 2024-11-02 15:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('number_of_players', models.IntegerField()),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('status', models.CharField(choices=[('waiting', 'Waiting for players'), ('ongoing', 'Ongoing'), ('ended', 'Ended'), ('aborted', 'Aborted')], default='waiting', max_length=20)),
                ('max_players', models.IntegerField()),
                ('current_match_index', models.IntegerField(default=0)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_tournaments', to=settings.AUTH_USER_MODEL)),
                ('players', models.ManyToManyField(related_name='tournaments', to=settings.AUTH_USER_MODEL)),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='won_tournaments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('p1_score', models.IntegerField(default=0)),
                ('p2_score', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('waiting', 'Game Waiting'), ('started', 'Game started'), ('ended', 'Game ended'), ('aborted', 'Game aborted')], default='waiting', max_length=20)),
                ('start_time', models.DateTimeField(auto_now=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_player1', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_player2', to=settings.AUTH_USER_MODEL)),
                ('tournament', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='matchmaker.tournament')),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='matches_as_winner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('p1_score', models.IntegerField(default=0)),
                ('p2_score', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('started', 'Game started'), ('ended', 'Game ended'), ('aborted', 'Game aborted')], default='started', max_length=20)),
                ('start_time', models.DateTimeField(auto_now=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player1', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player2', to=settings.AUTH_USER_MODEL)),
                ('winner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='games_as_winner', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
