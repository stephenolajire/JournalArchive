# Generated by Django 5.1.3 on 2025-03-24 22:26

import cloudinary_storage.storage
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Journal', '0003_savedjournal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='journal',
            name='file',
            field=models.FileField(max_length=500, storage=cloudinary_storage.storage.RawMediaCloudinaryStorage(), upload_to='journals/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'docx'])]),
        ),
    ]
