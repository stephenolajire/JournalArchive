from django.db import models
from django.contrib.auth import get_user_model
from cloudinary_storage.storage import RawMediaCloudinaryStorage
from django.core.validators import FileExtensionValidator

User = get_user_model()

class Journal(models.Model):
    FACULTY_CHOICES = [
        ("Faculty of Engineering", "Faculty of Engineering"),
        ("Faculty of Science", "Faculty of Science"),
        ("Faculty of Social Science", "Faculty of Social Science"),
        ("Faculty of Arts", "Faculty of Arts"),
        ("Faculty of Basic Science", "Faculty of Basic Science"),
        ("Faculty of Law", "Faculty of Law"),
        # Add more faculties if needed
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journals")
    title = models.CharField(max_length=255)
    faculty = models.CharField(max_length=50, choices=FACULTY_CHOICES)
    abstract = models.TextField(blank=True, null=True)
    keywords = models.CharField(max_length=255, blank=True, null=True)
    file = models.FileField(
        upload_to='journals/',
        storage=RawMediaCloudinaryStorage(),
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'docx'])],
        max_length=500
    )
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user.email}"

class SavedJournal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'journal']
