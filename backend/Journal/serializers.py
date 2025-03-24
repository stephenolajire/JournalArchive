from rest_framework import serializers
from .models import Journal, SavedJournal
from django.core.validators import FileExtensionValidator
from django.core.files.uploadedfile import UploadedFile

class JournalSerializer(serializers.ModelSerializer):
    file = serializers.FileField(
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'docx'])],
        required=True
    )
    
    class Meta:
        model = Journal
        fields = ['id', 'user', 'title', 'faculty', 'abstract', 'keywords', 'file', 'date_submitted']
        read_only_fields = ['id', 'user', 'date_submitted']
        extra_kwargs = {
            'title': {'required': True},
            'faculty': {'required': True},
            'abstract': {'required': True},
            'keywords': {'required': True}
        }

    def validate(self, data):
        """
        Object-level validation to ensure all required fields are present
        """
        required_fields = ['title', 'faculty', 'abstract', 'keywords', 'file']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError({field: f"{field} is required"})
        return data

    def validate_title(self, value):
        if not value:
            raise serializers.ValidationError("Title is required.")
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value.strip()

    def validate_faculty(self, value):
        VALID_FACULTIES = [
            'Faculty of Science',
            'Faculty of Engineering',
            'Faculty of Arts',
            'Faculty of Social Science',
            'Faculty of Basic Science',
            'Faculty of Law'
        ]
        if not value:
            raise serializers.ValidationError("Faculty is required.")
        if value.strip() not in VALID_FACULTIES:
            raise serializers.ValidationError(f"Faculty must be one of: {', '.join(VALID_FACULTIES)}")
        return value.strip()

    def validate_abstract(self, value):
        if not value:
            raise serializers.ValidationError("Abstract is required.")
        if len(value.strip()) < 20:
            raise serializers.ValidationError("Abstract must be at least 20 characters long.")
        if len(value) > 5000:  # Add maximum length
            raise serializers.ValidationError("Abstract must not exceed 5000 characters.")
        return value.strip()

    def validate_keywords(self, value):
        if not value:
            raise serializers.ValidationError("At least one keyword is required.")
        keywords_list = [kw.strip() for kw in value.split(",") if kw.strip()]
        if len(keywords_list) < 1:
            raise serializers.ValidationError("Please provide at least 2 keywords, separated by commas.")
        if len(keywords_list) > 100:  # Add maximum keywords limit
            raise serializers.ValidationError("Maximum 10 keywords are allowed.")
        # Remove duplicates and join back
        return ", ".join(list(dict.fromkeys(keywords_list)))

    def validate_file(self, value):
        if not value:
            raise serializers.ValidationError("A file is required.")
        
        if not isinstance(value, UploadedFile):
            raise serializers.ValidationError("Invalid file format")

        # File size validation (5MB)
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError(f"File size should not exceed 5MB")

        # Validate file extension
        allowed_extensions = ['pdf', 'docx']
        ext = value.name.split('.')[-1].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Invalid file type. Allowed types are: {', '.join(allowed_extensions)}"
            )
        
        return value

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Error creating journal: {str(e)}")

    def to_representation(self, instance):
        """
        Customize the output representation of the serializer
        """
        data = super().to_representation(instance)
        data['file_url'] = instance.file.url if instance.file else None
        data['file_name'] = instance.file.name.split('/')[-1] if instance.file else None
        return data

class SaveJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJournal
        fields = ['id', 'journal', 'saved_at']
