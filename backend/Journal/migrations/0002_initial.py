# Generated by Django 5.1.3 on 2025-04-14 12:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Journal', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='journal',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='journals', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='savedjournal',
            name='journal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Journal.journal'),
        ),
        migrations.AddField(
            model_name='savedjournal',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='savedjournal',
            unique_together={('user', 'journal')},
        ),
    ]
